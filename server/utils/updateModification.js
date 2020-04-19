module.exports = (ctx, modificationId, modification) =>
  ctx.prisma.updateModification({
    where: { id: modificationId },
    data: {
      removals: {
        set: modification.removals
      },
      sortings: {
        deleteMany: {
          uid_not_in: modification.sortings
            .filter(sorting => sorting.uid)
            .map(sorting => sorting.uid)
        },
        upsert: modification.sortings.map(sorting => ({
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
          uid_not_in: modification.alterations.map(alteration => alteration.uid)
        },
        upsert: modification.alterations.map(alteration => ({
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
          uid_not_in: modification.items.map(item => item.uid)
        },
        upsert: modification.items.map(item => ({
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
          uid_not_in: modification.steps.map(step => step.uid)
        },
        upsert: modification.steps.map(step => ({
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
          uid_not_in: modification.ingredients.map(ingredient => ingredient.uid)
        },
        upsert: modification.ingredients.map(ingredient => ({
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
