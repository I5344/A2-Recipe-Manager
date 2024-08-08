import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";


const httpLink = createHttpLink({
  uri: 'http://localhost:9000/',
});


const authLink = setContext((_, { headers }) => {
  const loginTokenInLocalData = localStorage.getItem('loginToken');
  return {
    headers: {
      ...headers,
      authorization: loginTokenInLocalData ? `Bearer ${loginTokenInLocalData}` : "",
    },
  };
});


const gqlapi = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default gqlapi;