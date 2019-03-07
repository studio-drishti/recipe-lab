module.exports = {
  ingredients: ({ id }, args, context) => {
    return context.prisma.step({ id }).ingredients();
  }
};
