const getUserId = require('../utils/getUserId');

module.exports = {
  sessionUser: (parent, args, ctx) => {
    const userId = getUserId(ctx);
    return ctx.prisma.user({ id: userId });
  },
  recipes: (parent, { where }, ctx) => ctx.prisma.recipes({ where }),
  recipe: (parent, { slug }, ctx) => ctx.prisma.recipe({ slug }),
  user: (parent, { slug }, ctx) => ctx.prisma.user({ slug }),
};
