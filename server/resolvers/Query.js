const getUserId = require('../utils/getUserId');

module.exports = {
  sessionUser: (parent, args, ctx) => {
    const userId = getUserId(ctx);
    return ctx.prisma.user.findOne({ where: { id: userId } });
  },
  recipes: (parent, args, ctx) => ctx.prisma.recipe.findMany(args),
  recipe: (parent, { slug }, ctx) =>
    ctx.prisma.recipe.findOne({ where: { slug } }),
  user: (parent, { slug }, ctx) => ctx.prisma.user.findOne({ where: { slug } }),
};
