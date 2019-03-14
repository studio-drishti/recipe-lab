module.exports = {
  alterations: ({ id }, args, context) => {
    return context.prisma.modification({ id }).alterations();
  }
};
