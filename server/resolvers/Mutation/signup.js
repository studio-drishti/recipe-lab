const { hash } = require('bcrypt');
const { sign } = require('jsonwebtoken');

module.exports = async (parent, { name, email, password }, ctx) => {
  const hashedPassword = await hash(password, 10);
  const user = await ctx.prisma.createUser({
    name,
    email,
    password: hashedPassword
  });
  return {
    token: sign({ userId: user.id }, process.env.APP_SECRET),
    user
  };
};
