const { rule, shield } = require('graphql-shield');
const getUserId = require('../utils/getUserId');

const rules = {
  isAuthenticatedUser: rule()((parent, args, context) => {
    const userId = getUserId(context);
    return Boolean(userId);
  })
  // isPostOwner: rule()(async (parent, { id }, context) => {
  //   const userId = getUserId(context);
  //   const author = await context.prisma
  //     .post({
  //       id
  //     })
  //     .author();
  //   return userId === author.id;
  // })
};

module.exports = shield({
  Query: {
    getUser: rules.isAuthenticatedUser
    // filterPosts: rules.isAuthenticatedUser,
    // post: rules.isAuthenticatedUser
  },
  Mutation: {
    // createDraft: rules.isAuthenticatedUser
    // deletePost: rules.isPostOwner,
    // publish: rules.isPostOwner
  }
});
