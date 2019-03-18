module.exports = async (parent, { author, recipe, sortings }, ctx) => {
  const mod = await ctx.prisma
    .modifications({
      where: { recipe: { id: recipe }, author: { id: author } }
    })
    .then(mods => mods.shift());

  if (mod) {
    const curSortings = await ctx.prisma
      .modification({ id: mod.id })
      .sortings()
      .then(sortings => sortings.map(sorting => sorting.parentId));

    await ctx.prisma.updateModification({
      where: {
        id: mod.id
      },
      data: {
        sortings: {
          deleteMany: {
            parentId_not_in: sortings.map(sorting => sorting.parentId)
          }
        }
      }
    });

    await ctx.prisma.updateModification({
      where: {
        id: mod.id
      },
      data: {
        sortings: {
          updateMany: sortings
            .filter(sorting => curSortings.includes(sorting.parentId))
            .map(sorting => ({
              where: {
                parentId: sorting.parentId
              },
              data: {
                order: {
                  set: sorting.order
                }
              }
            }))
        }
      }
    });

    return await ctx.prisma.updateModification({
      where: {
        id: mod.id
      },
      data: {
        sortings: {
          create: sortings
            .filter(sorting => !curSortings.includes(sorting.parentId))
            .map(sorting => ({
              parentId: sorting.parentId,
              order: {
                set: sorting.order
              }
            }))
        }
      }
    });
  } else {
    return await ctx.prisma.createModification({
      recipe: {
        connect: { id: recipe }
      },
      author: {
        connect: { id: author }
      },
      sortings: {
        create: sortings.map(sorting => ({
          parentId: sorting.parentId,
          order: {
            set: sorting.order
          }
        }))
      }
    });
  }
};
