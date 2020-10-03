const { hash } = require("bcryptjs");
const normalizeEmail = require("validator/lib/normalizeEmail");
const getUserId = require("../../utils/getUserId");

module.exports = async (
  parent,
  { userId, name, email, password, bio, slug, role },
  ctx
) => {
  const sessionUser = await ctx.prisma.user.findOne({
    where: { id: getUserId(ctx) },
  });

  const data = {
    name,
    email: normalizeEmail(email),
    bio,
    slug,
  };

  /**
   * Only Executive Chefs may change a user's role
   */
  if (role && sessionUser.role === "EXECUTIVE_CHEF") {
    data.role = role;
  }

  if (password) {
    const hashedPassword = await hash(password, 10);
    data.password = hashedPassword;
  }

  const user = await ctx.prisma.user.update({
    where: {
      id: userId,
    },
    data,
  });
  return user;
};
