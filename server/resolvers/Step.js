module.exports = {
  ingredients: ({ id }, args, ctx) => {
    return ctx.prisma.step({ id }).ingredients({ orderBy: 'index_ASC' });
  }
};
