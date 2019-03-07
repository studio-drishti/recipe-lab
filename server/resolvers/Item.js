module.exports = {
  steps: ({ id }, args, context) => {
    return context.prisma.item({ id }).steps();
  }
};
