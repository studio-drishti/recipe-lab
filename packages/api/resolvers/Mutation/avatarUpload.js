const fs = require('fs');
const path = require('path');
const { storeFS } = require('../../utils/fileUploads');

module.exports = async (parent, { file, userId }, ctx) => {
  const { createReadStream, filename: originalFilename, mimetype } = await file;

  if (!['image/jpeg', 'image/jpg'].includes(mimetype))
    throw new Error('Invalid file type');

  const dest = path.resolve(__dirname, '../../public/avatars');
  fs.mkdirSync(dest, { recursive: true });

  const user = await ctx.prisma.user.findOne({ where: { id: userId } });
  if (user.avatar) {
    const oldAvatar = path.join(dest, user.avatar);
    if (fs.existsSync(oldAvatar)) fs.unlinkSync(oldAvatar);
  }

  const stream = createReadStream();
  const { filename } = await storeFS(stream, dest, originalFilename);

  return await ctx.prisma.user.update({
    where: { id: userId },
    data: {
      avatar: filename,
    },
  });
};
