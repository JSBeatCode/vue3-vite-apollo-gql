import { createApp, provide } from 'vue';
import './style.css';
import App from './App.vue';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { DefaultApolloClient, ApolloClients } from '@vue/apollo-composable';

const httpLink = new HttpLink({
  uri: 'http://localhost:3586/graphql', // 첫 번째 GraphQL 서버의 주소로 변경해야 합니다.
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const httpLink2 = new HttpLink({
  uri: 'http://localhost:3569/graphql', // 두 번째 GraphQL 서버의 주소로 변경해야 합니다.
});

const apolloClient2 = new ApolloClient({
  link: httpLink2,
  cache: new InMemoryCache(),
});

const app = createApp(App);

// app.provide(DefaultApolloClient, apolloClient); // 첫 번째 Apollo Client 등록
app.provide(ApolloClients, {
  // 다중 Apollo Client 등록
  default: apolloClient,
  client2: apolloClient2,
});

app.mount('#app');
