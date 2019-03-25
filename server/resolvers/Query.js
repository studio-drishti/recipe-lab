const getUserId = require('../utils/getUserId');

module.exports = {
  sessionUser: (parent, args, ctx) => {
    const userId = getUserId(ctx);
    return ctx.prisma.user({ id: userId });
  },
  recipes: (parent, args, ctx) => {
    return ctx.prisma.recipes();
  },
  recipe: (parent, { uid }, ctx) => {
    return ctx.prisma.recipe({ uid });
  }
};
