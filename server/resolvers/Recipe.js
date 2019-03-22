module.exports = {
  author: ({ uid }, args, ctx) => {
    return ctx.prisma.recipe({ uid }).author();
  },
  items: ({ uid }, args, ctx) => {
    return ctx.prisma.recipe({ uid }).items({ orderBy: 'index_ASC' });
  },
  modification: ({ uid }, { user }, ctx) => {
    if (!user) return undefined;
    return ctx.prisma
      .modifications({
        where: { recipe: { uid }, user: { id: user } }
      })
      .then(mods => mods.shift());
  }
};
