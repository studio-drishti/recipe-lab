import gql from 'graphql-tag';

export default apolloClient =>
  apolloClient
    .query({
      query: gql`
        query getUser {
          user {
            id
            name
          }
        }
      `
    })
    .then(({ data }) => {
      return { user: data, csrfToken: 'foo' };
    })
    .catch(() => {
      // Fail gracefully
      return { user: {}, csrfToken: null };
    });
