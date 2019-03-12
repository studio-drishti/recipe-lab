const fs = require('fs');
const path = require('path');
const { hash, compare } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const getUserId = require('../utils/getUserId');
const { storeFS } = require('../utils/fileUploads');

module.exports = {
  signup: async (parent, { name, email, password }, context) => {
    const hashedPassword = await hash(password, 10);
    const user = await context.prisma.createUser({
      name,
      email,
      password: hashedPassword
    });
    return {
      token: sign({ userId: user.id }, process.env.APP_SECRET),
      user
    };
  },
  login: async (parent, { email, password }, context) => {
    const user = await context.prisma.user({ email });
    console.log(user);
    if (!user) {
      throw new Error(`No user found for email: ${email}`);
    }
    const passwordValid = await compare(password, user.password);
    if (!passwordValid) {
      throw new Error('Invalid password');
    }
    return {
      token: sign({ userId: user.id }, process.env.APP_SECRET),
      user
    };
  },
  avatarUpload: async (parent, { file }, context) => {
    const userId = getUserId(context);
    const {
      createReadStream,
      filename: originalFilename,
      mimetype,
      encoding
    } = await file;

    if (!userId || !context.prisma.$exists.user({ id: userId }))
      throw new Error('Must be signed in to upload a photo');

    if (!['image/jpeg', 'image/jpg'].includes(mimetype))
      throw new Error('Invalid file type');

    const dest = path.resolve(__dirname, '../public/avatars');
    fs.mkdirSync(dest, { recursive: true });

    const user = await context.prisma.user({ id: userId });
    if (user.avatar) {
      const oldAvatar = path.join(dest, user.avatar);
      if (fs.existsSync(oldAvatar)) fs.unlinkSync(oldAvatar);
    }

    const stream = createReadStream();
    const { filename } = await storeFS(stream, dest, originalFilename);

    await context.prisma.updateUser({
      where: { id: userId },
      data: {
        avatar: filename
      }
    });

    return { filename, mimetype, encoding };
  }
};
