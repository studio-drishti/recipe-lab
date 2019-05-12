module.exports = async (parent, args, ctx) => {
  const { photoIds, recipeId } = args;
  console.log('PhotoIds', photoIds);
  console.log('RecipeId', recipeId);

  await ctx.prisma.updateRecipe({
    where: { uid: recipeId },
    data: {
      photos: {
        update: photoIds.map((photoId, i) => ({
          where: { id: photoId },
          data: { index: i }
        }))
      }
    }
  });
  return true;
};
