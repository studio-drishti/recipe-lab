const getUserId = require('../utils/getUserId');

module.exports = {
  getUser: (parent, args, context) => {
    const userId = getUserId(context);
    return context.prisma.user({ id: userId });
  }
};
