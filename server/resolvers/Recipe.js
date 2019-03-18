module.exports = {
  author: ({ id }, args, ctx) => {
    return ctx.prisma.recipe({ id }).author();
  },
  items: ({ id }, args, ctx) => {
    return ctx.prisma.recipe({ id }).items({ orderBy: 'index_ASC' });
  }
};
