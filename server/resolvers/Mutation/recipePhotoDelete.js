const fs = require('fs');
const path = require('path');

module.exports = async (parent, { photoId }, ctx) => {
  // TODO: verify photo is owned by the user, set up a graphql shield rule for this

  const fragment = `
    fragment PhotoWithRecipe on RecipePhoto {
      filename
      recipe {
        uid
      }
    }
  `;
  const photo = await ctx.prisma
    .recipePhoto({ id: photoId })
    .$fragment(fragment);

  const src = path.resolve(
    __dirname,
    `../../public/recipes/${photo.recipe.uid}/${photo.filename}`
  );

  if (fs.existsSync(src)) {
    fs.unlinkSync(src);
    await ctx.prisma.deleteRecipePhoto({ id: photoId });
    return true;
  }

  return false;
};
