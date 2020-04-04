module.exports = async (parent, args, ctx) => {
  const {
    user,
    recipe,
    sortings,
    alterations,
    removals,
    items,
    steps,
    ingredients
  } = args;

  const mod = await ctx.prisma
    .modifications({
      where: { recipe: { uid: recipe }, user: { id: user } }
    })
    .then(mods => mods.shift());

  if (mod) {
    return await ctx.prisma.updateModification({
      where: { id: mod.id },
      data: {
        removals: {
          set: removals
        },
        sortings: {
          deleteMany: {
            uid_not_in: sortings
              .filter(sorting => sorting.uid)
              .map(sorting => sorting.uid)
          },
          upsert: sortings.map(sorting => ({
            where: { uid: sorting.uid },
            update: {
              order: {
                set: sorting.order
              }
            },
            create: {
              uid: sorting.uid,
              parentId: sorting.parentId,
              order: {
                set: sorting.order
              }
            }
          }))
        },
        alterations: {
          deleteMany: {
            uid_not_in: alterations.map(alteration => alteration.uid)
          },
          upsert: alterations.map(alteration => ({
            where: { uid: alteration.uid },
            update: {
              value: alteration.value
            },
            create: {
              uid: alteration.uid,
              sourceId: alteration.sourceId,
              field: alteration.field,
              value: alteration.value
            }
          }))
        },
        itemAdditions: {
          deleteMany: {
            uid_not_in: items.map(item => item.uid)
          },
          upsert: items.map(item => ({
            where: { uid: item.uid },
            update: {
              name: item.name
            },
            create: {
              uid: item.uid,
              parentId: item.parentId,
              name: item.name
            }
          }))
        },
        stepAdditions: {
          deleteMany: {
            uid_not_in: steps.map(step => step.uid)
          },
          upsert: steps.map(step => ({
            where: { uid: step.uid },
            update: {
              directions: step.directions
            },
            create: {
              uid: step.uid,
              parentId: step.parentId,
              directions: step.directions
            }
          }))
        },
        ingredientAdditions: {
          deleteMany: {
            uid_not_in: ingredients.map(ingredient => ingredient.uid)
          },
          upsert: ingredients.map(ingredient => ({
            where: { uid: ingredient.uid },
            update: {
              name: ingredient.name,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
              processing: ingredient.processing
            },
            create: {
              uid: ingredient.uid,
              parentId: ingredient.parentId,
              name: ingredient.name,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
              processing: ingredient.processing
            }
          }))
        }
      }
    });
  } else {
    return await ctx.prisma.createModification({
      recipe: {
        connect: { uid: recipe }
      },
      user: {
        connect: { id: user }
      },
      removals: {
        set: removals
      },
      sortings: {
        create: sortings.map(sorting => ({
          uid: sorting.uid,
          parentId: sorting.parentId,
          order: {
            set: sorting.order
          }
        }))
      },
      alterations: {
        create: alterations.map(alteration => ({
          uid: alteration.uid,
          sourceId: alteration.sourceId,
          field: alteration.field,
          value: alteration.value
        }))
      },
      itemAdditions: {
        create: items.map(item => ({
          uid: item.uid,
          parentId: item.parentId,
          name: item.name
        }))
      },
      stepAdditions: {
        create: steps.map(step => ({
          uid: step.uid,
          parentId: step.parentId,
          directions: step.directions
        }))
      },
      ingredientAdditions: {
        create: ingredients.map(ingredient => ({
          uid: ingredient.uid,
          parentId: ingredient.parentId,
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          processing: ingredient.processing
        }))
      }
    });
  }
};
