module.exports = async (parent, args, ctx) => {
  const { user, recipe, sortings, alterations, items } = args;
  const mod = await ctx.prisma
    .modifications({
      where: { recipe: { id: recipe }, user: { id: user } }
    })
    .then(mods => mods.shift());

  if (mod) {
    // Remove all entries which were removed on the frontend
    await ctx.prisma.updateModification({
      where: { id: mod.id },
      data: {
        sortings: {
          deleteMany: {
            uid_not_in: sortings
              .filter(sorting => sorting.uid)
              .map(sorting => sorting.uid)
          }
        },
        alterations: {
          deleteMany: {
            uid_not_in: alterations
              .filter(alteration => alteration.uid)
              .map(alteration => alteration.uid)
          }
        },
        itemAdditions: {
          deleteMany: {
            uid_not_in: items.filter(item => item.uid).map(item => item.uid)
          }
        }
      }
    });

    // Update all existing entries
    await ctx.prisma.updateModification({
      where: { id: mod.id },
      data: {
        sortings: {
          update: sortings
            .filter(sorting => sorting.uid)
            .map(sorting => ({
              where: { uid: sorting.uid },
              data: {
                order: {
                  set: sorting.order
                }
              }
            }))
        },
        alterations: {
          update: alterations
            .filter(alteration => alteration.uid)
            .map(alteration => ({
              where: { uid: alteration.uid },
              data: {
                value: alteration.value
              }
            }))
        },
        itemAdditions: {
          update: items
            .filter(item => item.uid)
            .map(item => ({
              where: { uid: item.uid },
              data: {
                name: item.name
              }
            }))
        }
      }
    });

    // Create any new entries
    return await ctx.prisma.updateModification({
      where: { id: mod.id },
      data: {
        sortings: {
          create: sortings
            .filter(sorting => !sorting.uid)
            .map(sorting => ({
              parentId: sorting.parentId,
              order: {
                set: sorting.order
              }
            }))
        },
        alterations: {
          create: alterations
            .filter(alteration => !alteration.uid)
            .map(alteration => ({
              sourceId: alteration.sourceId,
              field: alteration.field,
              value: alteration.value
            }))
        },
        itemAdditions: {
          create: items
            .filter(item => !item.uid)
            .map(item => ({
              clientId: item.id,
              parentId: item.parentId,
              name: item.name
            }))
        }
      }
    });
  } else {
    return await ctx.prisma.createModification({
      recipe: {
        connect: { id: recipe }
      },
      user: {
        connect: { id: user }
      },
      sortings: {
        create: sortings.map(sorting => ({
          parentId: sorting.parentId,
          order: {
            set: sorting.order
          }
        }))
      },
      alterations: {
        create: alterations.map(alteration => ({
          sourceId: alteration.sourceId,
          field: alteration.field,
          value: alteration.value
        }))
      },
      itemAdditions: {
        create: items.map(item => ({
          clientId: item.id,
          parentId: item.parentId,
          name: item.name
        }))
      }
    });
  }
};
