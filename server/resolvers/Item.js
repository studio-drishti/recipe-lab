module.exports = {
  steps: ({ id }, args, ctx) => {
    return ctx.prisma.item({ id }).steps({ orderBy: 'index_ASC' });
  }
};
