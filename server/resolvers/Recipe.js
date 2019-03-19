module.exports = {
  author: ({ id }, args, ctx) => {
    return ctx.prisma.recipe({ id }).author();
  },
  items: ({ id }, args, ctx) => {
    return ctx.prisma.recipe({ id }).items({ orderBy: 'index_ASC' });
  },
  modification: ({ id }, { user }, ctx) => {
    if (!user) return undefined;
    return ctx.prisma
      .modifications({
        where: { recipe: { id }, user: { id: user } }
      })
      .then(mods => mods.shift());
  }
};
