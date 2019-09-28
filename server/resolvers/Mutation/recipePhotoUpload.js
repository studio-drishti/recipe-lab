const fs = require('fs');
const path = require('path');
const { storeFS } = require('../../utils/fileUploads');

module.exports = async (parent, { file, recipeId }, ctx) => {
  const recipe = await ctx.prisma.recipe({ uid: recipeId }).$fragment(`
    fragment RecipeWithAuthor on Recipe {
      photoFilename
      author {
        id
      }
    }
  `);

  // if photoFilename, delete it

  const dest = path.resolve(__dirname, `../../public/${recipe.author.id}`);
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

  await ctx.prisma.updateRecipe({
    where: { uid: recipeId },
    data: {
      photoFilename: filename
    }
  });

  return { filename, mimetype, encoding };
};
