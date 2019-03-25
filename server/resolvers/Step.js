module.exports = {
  ingredients: ({ uid }, args, ctx) => {
    return ctx.prisma.step({ uid }).ingredients({ orderBy: 'index_ASC' });
  }
};
