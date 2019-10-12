module.exports = {
  recipes: ({ id }, args, ctx) => {
    return ctx.prisma.user({ id }).posts();
  },
  avatar: parent => {
    return parent.avatar ? `/public/avatars/${parent.avatar}` : null;
  }
};
