module.exports = {
  alterations: ({ id }, args, ctx) => {
    return ctx.prisma.modification.findOne({ where: { id } }).alterations();
  },
  sortings: ({ id }, args, ctx) => {
    return ctx.prisma.modification.findOne({ where: { id } }).sortings();
  },
  additions: async ({ id }, args, ctx) => {
    return [
      ...(await ctx.prisma.modification
        .findOne({ where: { id } })
        .itemAdditions()),
      ...(await ctx.prisma
        .modificationfindOne({ where: { id } })
        .stepAdditions()),
      ...(await ctx.prisma
        .modificationfindOne({ where: { id } })
        .ingredientAdditions()),
    ];
  },
  user: ({ id }, args, ctx) => {
    return ctx.prisma.modification.findOne({ where: { id } }).user();
  },
};
