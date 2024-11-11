// src/lib/apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Link para API Gateway
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql', // URL del API Gateway
});

// Middleware para incluir el token en cada solicitud
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
