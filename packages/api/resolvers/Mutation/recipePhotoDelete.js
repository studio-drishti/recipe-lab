const fs = require('fs');
const path = require('path');

module.exports = async (parent, { recipeId }, ctx) => {
  const recipe = await ctx.prisma.recipe.findOne({
    where: { uid: recipeId },
    select: { photo: true, author: { select: { slug: true } } },
  });

  if (!recipe.photo) throw new Error('No photo to delete');

  const dest = path.resolve(__dirname, `../../public/${recipe.author.slug}`);
  fs.mkdirSync(dest, { recursive: true });
  const oldPhoto = path.join(dest, recipe.photo);
  if (fs.existsSync(oldPhoto)) fs.unlinkSync(oldPhoto);
  return await ctx.prisma.recipe.update({
    where: { uid: recipeId },
    data: {
      photo: null,
    },
  });
};
