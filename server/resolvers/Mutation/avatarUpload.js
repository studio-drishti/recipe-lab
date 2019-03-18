const fs = require('fs');
const path = require('path');
const { storeFS } = require('../../utils/fileUploads');
const getUserId = require('../../utils/getUserId');

module.exports = async (parent, { file }, ctx) => {
  const userId = getUserId(ctx);
  const {
    createReadStream,
    filename: originalFilename,
    mimetype,
    encoding
  } = await file;

  if (!['image/jpeg', 'image/jpg'].includes(mimetype))
    throw new Error('Invalid file type');

  const dest = path.resolve(__dirname, '../../public/avatars');
  fs.mkdirSync(dest, { recursive: true });

  const user = await ctx.prisma.user({ id: userId });
  if (user.avatar) {
    const oldAvatar = path.join(dest, user.avatar);
    if (fs.existsSync(oldAvatar)) fs.unlinkSync(oldAvatar);
  }

  const stream = createReadStream();
  const { filename } = await storeFS(stream, dest, originalFilename);

  await ctx.prisma.updateUser({
    where: { id: userId },
    data: {
      avatar: filename
    }
  });

  return { filename, mimetype, encoding };
};
