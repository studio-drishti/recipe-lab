module.exports = {
  ingredients: ({ uid }, args, ctx) => {
    return ctx.prisma.step
      .findOne({ where: { uid } })
      .ingredients({ orderBy: { index: 'asc' } });
  },
};
