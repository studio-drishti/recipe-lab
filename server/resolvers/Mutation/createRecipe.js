const getSlug = require('speakingurl');
const getUserId = require('../../utils/getUserId');
const cuid = require('cuid');

const getUnusedSlug = async (originalSlug, ctx, i = 1) => {
  const slug = i > 1 ? `${originalSlug}-${i}` : originalSlug;
  const slugTaken = await ctx.prisma.$exists.recipe({ slug });
  if (!slugTaken) {
    return slug;
  }
  return getUnusedSlug(originalSlug, ctx, i + 1);
};

module.exports = async (parent, args, ctx) => {
  const userId = getUserId(ctx);
  const { title, time, servingAmount, servingType, description } = args;
  const slug = await getUnusedSlug(getSlug(title), ctx);

  return await ctx.prisma.createRecipe({
    uid: cuid(),
    slug,
    title,
    time,
    servingAmount,
    servingType,
    description,
    author: {
      connect: { id: userId },
    },
  });
};
