const { hash } = require('bcrypt');
const normalizeEmail = require('validator/lib/normalizeEmail');

module.exports = async (
  parent,
  { userId, name, email, password, bio, slug },
  ctx
) => {
  const data = {
    name,
    email: normalizeEmail(email),
    bio,
    slug
  };

  if (password) {
    const hashedPassword = await hash(password, 10);
    data.password = hashedPassword;
  }

  const user = await ctx.prisma.updateUser({
    where: {
      id: userId
    },
    data
  });
  return user;
};
