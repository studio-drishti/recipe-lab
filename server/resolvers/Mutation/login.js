const { compare } = require('bcrypt');
const { sign } = require('jsonwebtoken');

module.exports = async (parent, { email, password }, ctx) => {
  const user = await ctx.prisma.user({ email });
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
};
