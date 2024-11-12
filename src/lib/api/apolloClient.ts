// src/lib/apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getSession } from 'next-auth/react';

// Link para API Gateway
const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql", // Reemplaza con tu URL de GraphQL
});

// Middleware para incluir el token en cada solicitud
const authLink = setContext(async (_, { headers }) => {
  const session = await getSession(); // Obtiene el token desde la sesión de NextAuth
  const token = session?.accessToken;
  console.log("Token de sesión:", token); // Agrega esto para verificar el token
  
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
