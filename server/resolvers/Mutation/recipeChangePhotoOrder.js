module.exports = async (parent, args, ctx) => {
  const { photos } = args;

  photos.forEach(async element => {
    await ctx.prisma.updateRecipePhoto({
      data: {
        index: element.index
      },
      where: {
        id: element.id
      }
    });
  });
};
