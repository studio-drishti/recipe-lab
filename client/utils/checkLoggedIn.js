import gql from 'graphql-tag';

export default (apolloClient, fetchPolicy = 'cache-first') =>
  apolloClient
    .query({
      query: gql`
        {
          getUser {
            id
            name
            avatar
          }
        }
      `,
      fetchPolicy
    })
    .then(({ data }) => {
      return { user: data.getUser };
    })
    .catch(() => {
      // Fail gracefully
      return { user: null };
    });
