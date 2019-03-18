module.exports = {
  alterations: ({ id }, args, ctx) => {
    return ctx.prisma.modification({ id }).alterations();
  },
  sortings: ({ id }, args, ctx) => {
    return ctx.prisma.modification({ id }).sortings();
  }
};
