const { mod } = require('mathjs');

module.exports = {
  alterations: ({ id }, args, ctx) =>
    ctx.prisma.alteration.findMany({ where: { modification: { id } } }),
  sortings: ({ id }, args, ctx) =>
    ctx.prisma.sorting.findMany({ where: { modification: { id } } }),
  removals: async ({ id }, args, ctx) => {
    // const modification = await ctx.prisma.modification.findOne({
    //   where: { id },
    // });
    // console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXX');
    // console.log(modification);
    return [];
  },
  additions: async ({ id }, args, ctx) => {
    const modification = await ctx.prisma.modification.findOne({
      where: { modification: { id } },
      include: {
        itemAdditions: true,
        stepAdditions: true,
        ingredientAdditions: true,
      },
    });
    console.log('#########################################');
    console.log(modification);
    return [
      ...modification.itemAdditions,
      ...modification.stepAdditions,
      ...modification.ingredientAdditions,
    ];
  },
  user: ({ id }, args, ctx) =>
    ctx.prisma.modification.findOne({ where: { id } }).user(),
};
