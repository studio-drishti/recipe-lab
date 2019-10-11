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

  const dest = path.resolve(__dirname, `../../public/${recipe.author.slug}`);
  fs.mkdirSync(dest, { recursive: true });

  if (recipe.photo) {
    const oldPhoto = path.join(dest, recipe.photo);
    if (fs.existsSync(oldPhoto)) fs.unlinkSync(oldPhoto);
    await ctx.prisma.updateRecipe({
      where: { uid: recipeId },
      data: {
        photo: null
      }
    });
    return true;
  }

  return false;
};
