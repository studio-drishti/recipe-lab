import SessionUserQuery from '../graphql/SessionUser.graphql';

export default (apolloClient, fetchPolicy = 'cache-first') =>
  apolloClient
    .query({
      query: SessionUserQuery,
      fetchPolicy,
    })
    .then(({ data }) => {
      return { user: data.sessionUser };
    })
    .catch(() => {
      // Fail gracefully
      return { user: null };
    });
