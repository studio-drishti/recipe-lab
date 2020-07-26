const { rule, shield, or } = require('graphql-shield');
const getUserId = require('./utils/getUserId');

const rules = {
  /**
   * cache: 'contextual' is needed for routes that use graphql-upload.
   * See: https://github.com/maticzav/graphql-shield/issues/408
   */
  isAuthenticatedUser: rule({ cache: 'contextual' })((parent, args, ctx) => {
    const userId = getUserId(ctx);
    return Boolean(userId);
  }),
  isExecutiveChef: rule({ cache: 'contextual' })(async (parent, args, ctx) => {
    const userId = getUserId(ctx);
    const user = await ctx.prisma.user.findOne({
      where: { id: userId },
      select: { role: true },
    });
    return Boolean(user.role === 'EXECUTIVE_CHEF');
  }),
  isRecipeOwner: rule({ cache: 'contextual' })(
    async (parent, { recipeId }, ctx) => {
      const userId = getUserId(ctx);
      const recipeCount = await ctx.prisma.recipe.count({
        where: {
          uid: recipeId,
          author: { id: userId },
        },
      });
      return Boolean(recipeCount >= 1);
    }
  ),
  isAccountOwner: rule({ cache: 'contextual' })(async (parent, args, ctx) => {
    const userId = getUserId(ctx);
    return Boolean(userId && userId === args.userId);
  }),
};

module.exports = shield(
  {
    Query: {
      sessionUser: rules.isAuthenticatedUser,
    },
    Mutation: {
      avatarUpload: or(rules.isAccountOwner, rules.isExecutiveChef),
      avatarDelete: or(rules.isAccountOwner, rules.isExecutiveChef),
      recipePhotoUpload: or(rules.isRecipeOwner, rules.isExecutiveChef),
      recipePhotoDelete: or(rules.isRecipeOwner, rules.isExecutiveChef),
      updateUser: or(rules.isAccountOwner, rules.isExecutiveChef),
      publishRecipe: rules.isRecipeOwner,
    },
  },
  {
    fallbackError: false,
    allowExternalErros: true,
  }
);
