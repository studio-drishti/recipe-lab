module.exports = async (
  parent,
  { user, recipe, sortings, alterations },
  ctx
) => {
  const mod = await ctx.prisma
    .modifications({
      where: { recipe: { id: recipe }, user: { id: user } }
    })
    .then(mods => mods.shift());

  if (mod) {
    const sortedIds = await ctx.prisma
      .modification({ id: mod.id })
      .sortings()
      .then(sortings => sortings.map(sorting => sorting.parentId));

    const curAlterations = await ctx.prisma
      .modification({ id: mod.id })
      .alterations();

    // Remove any modifications from the database
    // which were removed on the front end
    await ctx.prisma.updateModification({
      where: {
        id: mod.id
      },
      data: {
        sortings: {
          deleteMany: {
            parentId_not_in: sortings.map(sorting => sorting.parentId)
          }
        },
        alterations: {
          deleteMany: {
            sourceId_not_in: alterations.map(alteration => alteration.sourceId),
            field_not_in: alterations.map(alteration => alteration.field)
            // NOT: alterations.map(alteration => ({
            //   sourceId: alteration.sourceId,
            //   field: alteration.field
            // }))
          }
        }
      }
    });

    // Update all existing modifications
    await ctx.prisma.updateModification({
      where: {
        id: mod.id
      },
      data: {
        sortings: {
          updateMany: sortings
            .filter(sorting => sortedIds.includes(sorting.parentId))
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
        },
        alterations: {
          updateMany: alterations
            .filter(alteration =>
              curAlterations.some(
                curAlteration =>
                  curAlteration.field === alteration.field &&
                  curAlteration.sourceId === alteration.sourceId
              )
            )
            .map(alteration => ({
              where: {
                sourceId: alteration.sourceId,
                field: alteration.field
              },
              data: {
                value: alteration.value
              }
            }))
        }
      }
    });

    // Create any new modifications
    return await ctx.prisma.updateModification({
      where: {
        id: mod.id
      },
      data: {
        sortings: {
          create: sortings
            .filter(sorting => !sortedIds.includes(sorting.parentId))
            .map(sorting => ({
              parentId: sorting.parentId,
              order: {
                set: sorting.order
              }
            }))
        },
        alterations: {
          create: alterations
            .filter(
              alteration =>
                !curAlterations.some(
                  curAlteration =>
                    curAlteration.field === alteration.field &&
                    curAlteration.sourceId === alteration.sourceId
                )
            )
            .map(alteration => ({
              sourceId: alteration.sourceId,
              field: alteration.field,
              value: alteration.value
            }))
        }
      }
    });
  } else {
    // Create a new modification and link it to the posted user
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
      }
    });
  }
};
