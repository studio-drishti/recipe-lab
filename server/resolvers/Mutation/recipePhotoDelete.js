const fs = require('fs');
const path = require('path');

module.exports = async (parent, { recipeId }, ctx) => {
  const recipe = await ctx.prisma.recipe({ uid: recipeId }).$fragment(`
    fragment RecipeWithAuthor on Recipe {
      photo
      author {
        slug
      }
    }
  `);

  if (!recipe.photo) throw new Error('No photo to delete');

  const dest = path.resolve(__dirname, `../../public/${recipe.author.slug}`);
  fs.mkdirSync(dest, { recursive: true });
  const oldPhoto = path.join(dest, recipe.photo);
  if (fs.existsSync(oldPhoto)) fs.unlinkSync(oldPhoto);
  return await ctx.prisma.updateRecipe({
    where: { uid: recipeId },
    data: {
      photo: null
    }
  });
};
