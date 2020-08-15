module.exports = {
  recipes: ({ id }, args, ctx) => {
    return ctx.prisma.user.findOne({ where: { id } }).recipes();
  },
  avatar: (parent) => {
    return parent.avatar
      ? `/public/avatars/${parent.avatar}`
      : `/static/placeholders/avatar-${Math.floor(Math.random() * 2 + 1)}.jpg`;
  },
  recipeCount: ({ id }, args, ctx) => {
    return ctx.prisma.recipe.count({
      where: {
        author: { id },
      },
    });
  },
  modifiedRecipeCount: ({ id }, args, ctx) => {
    return ctx.prisma.modification.count({
      where: {
        user: { id },
      },
    });
  },
};
