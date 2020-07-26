module.exports = {
  steps: ({ uid }, args, ctx) => {
    return ctx.prisma.item
      .findOne({ where: { uid } })
      .steps({ orderBy: { index: 'asc' } });
  },
};
