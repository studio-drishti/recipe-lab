module.exports = (ctx, recipeId, userId, modification) =>
  ctx.prisma.createModification({
    recipe: {
      connect: { uid: recipeId },
    },
    user: {
      connect: { id: userId },
    },
    removals: {
      set: modification.removals,
    },
    sortings: {
      create: modification.sortings.map((sorting) => ({
        uid: sorting.uid,
        parentId: sorting.parentId,
        order: {
          set: sorting.order,
        },
      })),
    },
    alterations: {
      create: modification.alterations.map((alteration) => ({
        uid: alteration.uid,
        sourceId: alteration.sourceId,
        field: alteration.field,
        value: alteration.value,
      })),
    },
    itemAdditions: {
      create: modification.items.map((item) => ({
        uid: item.uid,
        parentId: item.parentId,
        name: item.name,
      })),
    },
    stepAdditions: {
      create: modification.steps.map((step) => ({
        uid: step.uid,
        parentId: step.parentId,
        directions: step.directions,
      })),
    },
    ingredientAdditions: {
      create: modification.ingredients.map((ingredient) => ({
        uid: ingredient.uid,
        parentId: ingredient.parentId,
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        processing: ingredient.processing,
      })),
    },
  });
