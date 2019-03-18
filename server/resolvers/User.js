module.exports = {
  recipes: ({ id }, args, ctx) => {
    return ctx.prisma.user({ id }).posts();
  },
  avatar: parent => {
    return '/public/avatars/' + parent.avatar;
  }
};
