const getUserId = require('../../utils/getUserId');

module.exports = async (parent, { recipeId }, ctx) => {
  const userId = getUserId(ctx);
  const recipe = await ctx.prisma.recipe({ uid: recipeId }).$fragment(`
    fragment RecipeWithEverything on Recipe {
      id
      uid
      slug
      title
      time
      servingAmount
      servingType
      description
      items {
        uid
        index
        name
        steps {
          uid
          index
          directions
          ingredients {
            uid
            index
            name
            quantity
            unit
            processing
          }
        }
      }
    }
  `);

  const mod = await ctx.prisma
    .modifications({
      where: { recipe: { uid: recipeId }, user: { id: userId } }
    })
    .$fragment(
      `
      fragment ModificationWithEverything on Modification {
        id
        removals
        sortings {
          parentId
          order
        }
        alterations {
          sourceId
          field
          value
        }
        itemAdditions {
          uid
          parentId
          name
        }
        stepAdditions {
          uid
          parentId
          directions
        }
        ingredientAdditions {
          uid
          parentId
          name
          quantity
          unit
          processing
        }
      }
    `
    )
    .then(mods => mods.shift());

  if (!mod)
    throw new Error(
      'No modification found for this recipe + user combination.'
    );

  const {
    sortings,
    alterations,
    removals,
    itemAdditions,
    stepAdditions,
    ingredientAdditions
  } = mod;

  const maybeGetAlteration = (fieldName, source) => {
    const mod = alterations.find(
      mod => mod.sourceId === source.uid && mod.field === fieldName
    );
    return mod ? mod.value : source[fieldName];
  };

  const maybeGetSortingIndex = (source, parentId) => {
    const sorting = sortings.find(sorting => sorting.parentId === parentId);
    if (sorting) return sorting.order.indexOf(source.uid);
    if (source.index) return source.index;
    return 0;
  };

  const updateIngredients = (step, ingredient) => ({
    where: { uid: ingredient.uid },
    data: {
      index: maybeGetSortingIndex(ingredient, step.uid),
      name: maybeGetAlteration('name', ingredient),
      quantity: maybeGetAlteration('quantity', ingredient),
      unit: maybeGetAlteration('unit', ingredient),
      processing: maybeGetAlteration('processing', ingredient)
    }
  });

  const createIngredients = (step, ingredient) => ({
    uid: ingredient.uid,
    index: maybeGetSortingIndex(ingredient, step.uid),
    name: ingredient.name,
    quantity: ingredient.quantity,
    unit: ingredient.unit,
    processing: ingredient.processing
  });

  const updateSteps = (item, step) => ({
    where: { uid: step.uid },
    data: {
      index: maybeGetSortingIndex(step, item.uid),
      directions: maybeGetAlteration('directions', step),
      ingredients: {
        update: step.ingredients
          .filter(ingredient => !removals.includes(ingredient.uid))
          .map(ingredient => updateIngredients(step, ingredient)),
        create: ingredientAdditions
          .filter(addition => addition.parentId === step.uid)
          .map(ingredient => createIngredients(step, ingredient))
      }
    }
  });

  const createSteps = (item, step) => ({
    uid: step.uid,
    index: maybeGetSortingIndex(step, item.uid),
    directions: step.directions,
    ingredients: {
      create: ingredientAdditions
        .filter(addition => addition.parentId === step.uid)
        .map(ingredient => createIngredients(step, ingredient))
    }
  });

  const updateItems = item => ({
    where: { uid: item.uid },
    data: {
      index: maybeGetSortingIndex(item, recipe.uid),
      name: maybeGetAlteration('name', item),
      steps: {
        update: item.steps.map(step => updateSteps(item, step)),
        create: stepAdditions
          .filter(addition => addition.parentId === item.uid)
          .map(step => createSteps(item, step))
      }
    }
  });

  const createItems = item => ({
    uid: item.uid,
    name: item.name,
    index: maybeGetSortingIndex(item, recipe.uid),
    steps: {
      create: stepAdditions
        .filter(addition => addition.parentId === item.uid)
        .map(step => createSteps(item, step))
    }
  });

  await ctx.prisma.deleteManySteps({
    uid_in: removals,
    item: { recipe: { id: recipe.id } }
  });
  await ctx.prisma.deleteManyIngredients({
    uid_in: removals,
    step: { item: { recipe: { id: recipe.id } } }
  });

  const publishedRecipe = await ctx.prisma.updateRecipe({
    where: { uid: recipeId },
    data: {
      title: maybeGetAlteration('title', recipe),
      time: maybeGetAlteration('time', recipe),
      servingAmount: maybeGetAlteration('servingAmount', recipe),
      servingType: maybeGetAlteration('servingType', recipe),
      description: maybeGetAlteration('description', recipe),
      items: {
        deleteMany: {
          uid_in: removals
        },
        update: recipe.items
          .filter(item => !removals.includes(item.uid))
          .map(updateItems),
        create: itemAdditions.map(createItems)
      }
    }
  });

  await ctx.prisma.deleteModification({ id: mod.id });

  return publishedRecipe;
};
