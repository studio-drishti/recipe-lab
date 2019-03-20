module.exports = {
  alterations: ({ id }, args, ctx) => {
    return ctx.prisma.modification({ id }).alterations();
  },
  sortings: ({ id }, args, ctx) => {
    return ctx.prisma.modification({ id }).sortings();
  },
  additions: ({ id }, args, ctx) => {
    return ctx.prisma.modification({ id }).itemAdditions();
  },
  user: ({ id }, args, ctx) => {
    return ctx.prisma.modification({ id }).user();
  }
};
