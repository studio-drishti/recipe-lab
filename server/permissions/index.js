const { rule, shield } = require('graphql-shield');
const getUserId = require('../utils/getUserId');

const rules = {
  /**
   * cache: 'contextual' is needed for routes that use graphql-upload.
   * See: https://github.com/maticzav/graphql-shield/issues/408
   */
  isAuthenticatedUser: rule({ cache: 'contextual' })((parent, args, ctx) => {
    const userId = getUserId(ctx);
    return Boolean(userId);
  }),
  isRecipeOwner: rule({ cache: 'contextual' })(
    async (parent, { recipeId }, ctx) => {
      const userId = getUserId(ctx);
      return await ctx.prisma.$exists.recipe({
        uid: recipeId,
        author: { id: userId }
      });
    }
  )
};

module.exports = shield({
  Query: {
    sessionUser: rules.isAuthenticatedUser
  },
  Mutation: {
    avatarUpload: rules.isAuthenticatedUser,
    recipePhotoUpload: rules.isRecipeOwner
  }
});
