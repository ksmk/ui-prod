import ApolloClient from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getToken } from '../_Components/utils/getToken';
import * as _fetch from 'isomorphic-fetch';
import { HttpLink } from 'apollo-link-http';
import { createHttpLink } from 'apollo-link-http';

const httpLink = createHttpLink({
  uri: process.env.GRAPHQL,
  fetch: _fetch,
});

const authLink = setContext((_, { headers }) => {
  if (typeof localStorage !== 'undefined') {
    const token = getToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  }
  return false;
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
