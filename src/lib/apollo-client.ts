import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Configure your GraphQL endpoint here
const httpLink = createHttpLink({
  uri: process.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
