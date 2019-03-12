import gql from 'graphql-tag';

export default apolloClient =>
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
      `
    })
    .then(({ data }) => {
      return { user: data.getUser, csrfToken: 'foo' };
    })
    .catch(() => {
      // Fail gracefully
      return { user: null, csrfToken: null };
    });
