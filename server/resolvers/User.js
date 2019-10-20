module.exports = {
  recipes: ({ id }, args, ctx) => {
    return ctx.prisma.user({ id }).posts();
  },
  avatar: parent => {
    return parent.avatar ? `/public/avatars/${parent.avatar}` : null;
  },
  recipeCount: ({ id }, args, ctx) => {
    return ctx.prisma
      .recipesConnection({ where: { author: { id } } })
      .aggregate()
      .count();
  },
  modifiedRecipeCount: ({ id }, args, ctx) => {
    return ctx.prisma
      .modificationsConnection({
        where: {
          AND: [{ user: { id } }, { recipe: { author: { id_not: id } } }]
        }
      })
      .aggregate()
      .count();
  }
};
