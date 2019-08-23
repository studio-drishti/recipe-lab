import {
  ApolloClient,
  InMemoryCache,
  IntrospectionFragmentMatcher
} from 'apollo-boost';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from 'apollo-link-context';
import fetch from 'isomorphic-unfetch';

let apolloClient = null;
const isBrowser = typeof window !== 'undefined';

// Polyfill fetch() on the server (used by apollo-client)
if (!isBrowser) {
  global.fetch = fetch;
}

function create(initialState, { getToken }) {
  const httpLink = createUploadLink({
    uri: 'http://localhost:3000/graphql',
    credentials: 'same-origin'
  });

  const authLink = setContext((_, { headers }) => {
    const token = getToken();
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : ''
      }
    };
  });

  // Needed for using interfaces and unions for some reason...
  // See: https://github.com/apollographql/apollo-client/issues/3397
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
      __schema: {
        types: []
      }
    }
  });

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({ fragmentMatcher }).restore(initialState || {})
  });
}

export default function initApollo(initialState, options) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!isBrowser) {
    return create(initialState, options);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, options);
  }

  return apolloClient;
}
