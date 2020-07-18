const getUserId = require('../utils/getUserId');

module.exports = {
  author: ({ uid }, args, ctx) => {
    return ctx.prisma.recipe.findOne({ where: { uid } }).author();
  },
  items: ({ uid }, args, ctx) => {
    return ctx.prisma.recipe
      .findOne({ where: { uid } })
      .items({ orderBy: { index: 'asc' } });
  },
  photo: async ({ uid }, args, ctx) => {
    const recipe = await ctx.prisma.recipe.findOne({
      where: { uid },
      include: { author: true },
    });

    return recipe.photo
      ? `/public/${recipe.author.slug}/${recipe.photo}`
      : `/static/placeholders/recipe-${Math.floor(Math.random() * 3 + 1)}.jpg`;
  },
  modification: ({ uid }, { user }, ctx) => {
    if (!user) {
      try {
        user = getUserId(ctx);
      } catch {
        return undefined;
      }
    }

    return ctx.prisma.modification
      .findMany({
        where: { recipe: { uid }, user: { id: user } },
      })
      .then((mods) => mods.shift());
  },
};
