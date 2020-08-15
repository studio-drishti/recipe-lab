const { mod } = require('mathjs');

module.exports = {
  alterations: ({ id }, args, ctx) =>
    ctx.prisma.alteration.findMany({ where: { modification: { id } } }),
  sortings: ({ id }, args, ctx) =>
    ctx.prisma.sorting.findMany({ where: { modification: { id } } }),
  additions: async ({ id }, args, ctx) => {
    const modification = await ctx.prisma.modification.findOne({
      where: { id },
      include: {
        itemAdditions: true,
        stepAdditions: true,
        ingredientAdditions: true,
      },
    });
    return [
      ...modification.itemAdditions,
      ...modification.stepAdditions,
      ...modification.ingredientAdditions,
    ];
  },
  user: ({ id }, args, ctx) =>
    ctx.prisma.modification.findOne({ where: { id } }).user(),
};
