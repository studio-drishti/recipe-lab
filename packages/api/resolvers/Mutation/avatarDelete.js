const fs = require('fs');
const path = require('path');

module.exports = async (parent, { userId }, ctx) => {
  const user = await ctx.prisma.user.findOne({ where: { id: userId } });

  if (!user.avatar) throw new Error('Nothing to delete');

  const avatar = path.resolve(__dirname, '../../public/avatars', user.avatar);

  if (!fs.existsSync(avatar)) throw new Error('Avatar does not exist');

  fs.unlinkSync(avatar);

  return await ctx.prisma.user.update({
    where: { id: userId },
    data: {
      avatar: null,
    },
  });
};
