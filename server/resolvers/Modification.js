module.exports = {
  alterations: ({ id }, args, ctx) => {
    return ctx.prisma.modification({ id }).alterations();
  },
  sortings: ({ id }, args, ctx) => {
    return ctx.prisma.modification({ id }).sortings();
  },
  additions: async ({ id }, args, ctx) => {
    return [
      ...(await ctx.prisma.modification({ id }).itemAdditions()),
      ...(await ctx.prisma.modification({ id }).stepAdditions()),
      ...(await ctx.prisma.modification({ id }).ingredientAdditions())
    ];
  },
  user: ({ id }, args, ctx) => {
    return ctx.prisma.modification({ id }).user();
  }
};
