import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { PubSub } from 'graphql-subscriptions'; // 수정된 부분
import cors from 'cors';
import customers from './data.mjs';

const app = express();

customers;

const pubsub = new PubSub(); // 수정된 부분

const typeDefs = gql`
  type Customer {
    id: String!
    name: String!
    email: String!
    age: Int!
  }

  type Query {
    getCustomers: [Customer!]!
    getCustomer(id: ID!): Customer
  }

  type Mutation {
    addCustomer(name: String!, email: String!, age: Int!): Customer
    updateCustomer(id: ID!, name: String, email: String, age: Int): Customer
    deleteCustomer(id: ID!): ID
  }

  type Subscription {
    customerAdded: Customer
    customerDeleted: ID
  }
`;

const resolvers = {
  Query: {
    getCustomers: () => customers,
    getCustomer: (parent, args) => customers.find((customer) => customer.id === args.id),
  },
  Mutation: {
    addCustomer: (parent, args) => {
      const newCustomer = {
        id: String(Math.random() * 100),
        name: args.name,
        email: args.email,
        age: args.age,
      };

      customers.push(newCustomer);
      pubsub.publish('CUSTOMER_ADDED', { customerAdded: newCustomer });

      return newCustomer;
    },
    updateCustomer: (parent, args) => {
      const customerIndex = customers.findIndex((customer) => customer.id === args.id);

      if (customerIndex === -1) {
        throw new Error('Customer not found');
      }

      customers[customerIndex].name = args.name || customers[customerIndex].name;
      customers[customerIndex].email = args.email || customers[customerIndex].email;
      customers[customerIndex].age = args.age || customers[customerIndex].age;

      return customers[customerIndex];
    },
    deleteCustomer: (parent, args) => {
      const customerIndex = customers.findIndex((customer) => customer.id === args.id);

      if (customerIndex === -1) {
        throw new Error('Customer not found');
      }

      const deletedCustomerId = customers[customerIndex].id;
      customers.splice(customerIndex, 1);
      pubsub.publish('CUSTOMER_DELETED', { customerDeleted: deletedCustomerId });

      return deletedCustomerId;
    },
  },
  Subscription: {
    customerAdded: {
      subscribe: () => pubsub.asyncIterator('CUSTOMER_ADDED'),
    },
    customerDeleted: {
      subscribe: () => pubsub.asyncIterator('CUSTOMER_DELETED'),
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  app.use(cors());

  server.applyMiddleware({ app });

  const port = 3586;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}${server.graphqlPath}`);
  });
});
