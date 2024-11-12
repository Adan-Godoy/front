import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { gql, ApolloClient, InMemoryCache } from '@apollo/client';

// Configuración de Apollo Client para GraphQL
const client = new ApolloClient({
  uri: process.env.GRAPHQL_API_URL,
  cache: new InMemoryCache(),
});

// Consulta para verificar si el usuario ya existe en la base de datos
const CHECK_USER = gql`
  query CheckUser($email: String!) {
    checkUser(email: $email) {
      id
      email
      username
      role
    }
  }
`;

// Mutación para crear un usuario en la base de datos si no existe
const CREATE_USER = gql`
  mutation CreateGoogleUser($email: String!, $username: String!, $role: UserRole!) {
    createGoogleUser(createGoogleUserInput: { email: $email, username: $username, role: $role }) {
      id
      email
      username
      role
    }
  }
`;

// Mutación para iniciar sesión con credenciales
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(loginInput: {
      email: $email
      password: $password
    }) {
      token
      user {
        id
        username
        email
        role
        createdAt
        updatedAt
      }
    }
  }
`;

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          const { data } = await client.mutate({
            mutation: LOGIN_MUTATION,
            variables: {
              email: credentials.email,
              password: credentials.password,
            },
          });

          if (data.login) {
            return {
              id: data.login.user.id,
              name: data.login.user.username,
              email: data.login.user.email,
              role: data.login.user.role,
              accessToken: data.login.token,
            };
          }

          return null;
        } catch (error) {
          console.error('Error en el inicio de sesión:', error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        try {
          const { data } = await client.query({
            query: CHECK_USER,
            variables: { email: profile.email },
          });

          if (!data.checkUser) {
            // Crear un nuevo usuario si no existe en la base de datos
            const createdUser = await client.mutate({
              mutation: CREATE_USER,
              variables: {
                email: profile.email,
                username: profile.name,
                role: 'STUDENT',
              },
            });
            user.id = createdUser.data.createGoogleUser.id;
          } else {
            // Si el usuario ya existe, usa su ID
            user.id = data.checkUser.id;
          }

          user.accessToken = account.access_token; // Guarda el accessToken de Google en el objeto user
          return true;
        } catch (error) {
          console.error('Error en el proceso de inicio de sesión con Google:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Almacenar el accessToken de Google o del inicio de sesión normal
      if (account && account.provider === 'google' && account.access_token) {
        token.accessToken = account.access_token;
      } else if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken || null;
      }
      console.log("JWT Token:", token); // Debug
      return token;
    },
    async session({ session, token }) {
      session.userId = token.id;
      session.accessToken = token.accessToken;
      console.log("Session:", session); // Debug
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
};

// Exporta handlers específicos para GET y POST en lugar de `export default`
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
