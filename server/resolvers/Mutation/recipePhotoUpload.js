const fs = require('fs');
const path = require('path');
const { storeFS } = require('../../utils/fileUploads');

module.exports = async (parent, { file, recipeId }, ctx) => {
  const recipe = await ctx.prisma.recipe.findOne({
    where: { uid: recipeId },
    select: { photo: true, author: { select: { slug: true } } },
  });

  const dest = path.resolve(__dirname, `../../public/${recipe.author.slug}`);
  fs.mkdirSync(dest, { recursive: true });

  if (recipe.photo) {
    const oldPhoto = path.join(dest, recipe.photo);
    if (fs.existsSync(oldPhoto)) fs.unlinkSync(oldPhoto);
  }

  const { createReadStream, filename: originalFilename, mimetype } = await file;

  if (!['image/jpeg', 'image/jpg'].includes(mimetype))
    throw new Error('Invalid file type');

  const stream = createReadStream();
  const { filename } = await storeFS(stream, dest, originalFilename);

  return await ctx.prisma.recipe.update({
    where: { uid: recipeId },
    data: {
      photo: filename,
    },
  });
};
