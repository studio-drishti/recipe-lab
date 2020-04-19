module.exports = {
  steps: ({ uid }, args, ctx) => {
    return ctx.prisma.item({ uid }).steps({ orderBy: 'index_ASC' });
  },
};
