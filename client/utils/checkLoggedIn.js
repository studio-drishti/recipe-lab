import gql from 'graphql-tag';

export default (apolloClient, fetchPolicy = 'cache-first') =>
  apolloClient
    .query({
      query: gql`
        {
          sessionUser {
            id
            name
            avatar
          }
        }
      `,
      fetchPolicy
    })
    .then(({ data }) => {
      return { user: data.sessionUser };
    })
    .catch(() => {
      // Fail gracefully
      return { user: null };
    });
