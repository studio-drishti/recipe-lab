const { hash } = require('bcrypt');

module.exports = async (
  parent,
  { userId, name, email, password, bio, slug },
  ctx
) => {
  const data = {
    name,
    email,
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
