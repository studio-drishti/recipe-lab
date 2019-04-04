const fs = require('fs');
const path = require('path');
const { storeFS } = require('../../utils/fileUploads');
const getUserId = require('../../utils/getUserId');

module.exports = async (parent, { file, recipeId }, ctx) => {
  const userId = getUserId(ctx);

  // TODO: verify recipe exists or add a graphql shield rule that
  //       only lets owners post photos to own recipes

  const dest = path.resolve(__dirname, `../../public/recipes/${recipeId}`);
  fs.mkdirSync(dest, { recursive: true });

  const {
    createReadStream,
    filename: originalFilename,
    mimetype,
    encoding
  } = await file;

  if (!['image/jpeg', 'image/jpg'].includes(mimetype))
    throw new Error('Invalid file type');

  const stream = createReadStream();
  const { filename } = await storeFS(stream, dest, originalFilename);

  return await ctx.prisma.createRecipePhoto({
    filename,
    url: `/public/recipes/${recipeId}/${filename}`,
    recipe: {
      connect: { uid: recipeId }
    }
  });
};
