const getUserId = require('../utils/getUserId');

module.exports = {
  getUser: (parent, args, context) => {
    const userId = getUserId(context);
    return context.prisma.user({ id: userId });
  },
  recipes: (parent, args, context) => {
    return context.prisma.recipes();
  },
  recipe: (parent, { id }, context) => {
    return context.prisma.recipe({ id });
  }
};
