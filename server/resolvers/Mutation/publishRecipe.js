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
      items(orderBy: index_ASC) {
        uid
        index
        name
        steps(orderBy: index_ASC) {
          uid
          index
          directions
          ingredients(orderBy: index_ASC) {
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

  const maybeGetSortingIndex = (source, parentId, index = 0) => {
    const sorting = sortings.find(sorting => sorting.parentId === parentId);
    if (sorting) return sorting.order.indexOf(source.uid);
    return index;
  };

  const updateIngredients = (step, ingredient, i) => ({
    where: { uid: ingredient.uid },
    data: {
      index: maybeGetSortingIndex(ingredient, step.uid, i),
      name: maybeGetAlteration('name', ingredient),
      quantity: maybeGetAlteration('quantity', ingredient),
      unit: maybeGetAlteration('unit', ingredient),
      processing: maybeGetAlteration('processing', ingredient)
    }
  });

  const createIngredients = (step, ingredient, i) => ({
    uid: ingredient.uid,
    index: maybeGetSortingIndex(ingredient, step.uid, i),
    name: ingredient.name,
    quantity: ingredient.quantity,
    unit: ingredient.unit,
    processing: ingredient.processing
  });

  const updateSteps = (item, step, i) => {
    const ingredients = step.ingredients.filter(
      ingredient => !removals.includes(ingredient.uid)
    );
    return {
      where: { uid: step.uid },
      data: {
        index: maybeGetSortingIndex(step, item.uid, i),
        directions: maybeGetAlteration('directions', step),
        ingredients: {
          update: ingredients.map((ingredient, i) =>
            updateIngredients(step, ingredient, i)
          ),
          create: ingredientAdditions
            .filter(addition => addition.parentId === step.uid)
            .map((ingredient, i) =>
              createIngredients(step, ingredient, i + ingredients.length)
            )
        }
      }
    };
  };

  const createSteps = (item, step, i) => ({
    uid: step.uid,
    index: maybeGetSortingIndex(step, item.uid, i),
    directions: step.directions,
    ingredients: {
      create: ingredientAdditions
        .filter(addition => addition.parentId === step.uid)
        .map((ingredient, i) => createIngredients(step, ingredient, i))
    }
  });

  const updateItems = (item, i) => {
    const steps = item.steps.filter(step => !removals.includes(step.uid));
    return {
      where: { uid: item.uid },
      data: {
        index: maybeGetSortingIndex(item, recipe.uid, i),
        name: maybeGetAlteration('name', item),
        steps: {
          update: steps.map((step, i) => updateSteps(item, step, i)),
          create: stepAdditions
            .filter(addition => addition.parentId === item.uid)
            .map((step, i) => createSteps(item, step, i + steps.length))
        }
      }
    };
  };

  const createItems = (item, i) => ({
    uid: item.uid,
    name: item.name,
    index: maybeGetSortingIndex(item, recipe.uid, i),
    steps: {
      create: stepAdditions
        .filter(addition => addition.parentId === item.uid)
        .map((step, i) => createSteps(item, step, i))
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

  const items = recipe.items.filter(item => !removals.includes(item.uid));
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
        update: items.map(updateItems),
        create: itemAdditions.map((item, i) =>
          createItems(item, i + items.length)
        )
      }
    }
  });

  await ctx.prisma.deleteModification({ id: mod.id });

  return publishedRecipe;
};
