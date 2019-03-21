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
        },
        stepAdditions: {
          deleteMany: {
            uid_not_in: steps.filter(step => step.uid).map(step => step.uid)
          }
        },
        ingredientAdditions: {
          deleteMany: {
            uid_not_in: ingredients
              .filter(ingredient => ingredient.uid)
              .map(ingredient => ingredient.uid)
          }
        }
      }
    });

    // Update all existing entries
    await ctx.prisma.updateModification({
      where: { id: mod.id },
      data: {
        removals: {
          set: removals
        },
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
        },
        stepAdditions: {
          update: steps
            .filter(step => step.uid)
            .map(step => ({
              where: { uid: step.uid },
              data: {
                directions: step.directions,
                notes: step.notes
              }
            }))
        },
        ingredientAdditions: {
          update: ingredients
            .filter(ingredient => ingredient.uid)
            .map(ingredient => ({
              where: { uid: ingredient.uid },
              data: {
                name: ingredient.name,
                quantity: ingredient.quantity,
                unit: ingredient.unit,
                processing: ingredient.processing
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
        },
        stepAdditions: {
          create: steps
            .filter(step => !step.uid)
            .map(step => ({
              clientId: step.id,
              parentId: step.parentId,
              directions: step.directions,
              notes: step.notes
            }))
        },
        ingredientAdditions: {
          create: ingredients
            .filter(ingredient => !ingredient.uid)
            .map(ingredient => ({
              clientId: ingredient.id,
              parentId: ingredient.parentId,
              name: ingredient.name,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
              processing: ingredient.processing
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
      removals: {
        set: removals
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
      },
      stepAdditions: {
        create: steps.map(step => ({
          clientId: step.id,
          parentId: step.parentId,
          directions: step.directions,
          notes: step.notes
        }))
      },
      ingredientAdditions: {
        create: ingredients.map(ingredient => ({
          clientId: ingredient.id,
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
