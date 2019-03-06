module.exports = {
  recipes: ({ id }, args, context) => {
    return context.prisma.user({ id }).posts();
  }
};
