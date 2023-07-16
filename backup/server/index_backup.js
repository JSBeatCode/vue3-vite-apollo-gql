// const { ApolloServer, gql } = require('apollo-server-express');
// const express = require('express');

import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import cors from 'cors';
import customers from '../../server/data.mjs'


const app = express();

customers;

const typeDefs = gql`
  type Customer {
    id: ID!
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
`;

const resolvers = {
  Query: {
    getCustomers: () => customers,
    getCustomer: (parent, args) => customers.find((customer) => customer.id === args.id),
  },
  Mutation: {
    addCustomer: (parent, args) => {
      const newCustomer = {
        id: String(customers.length + 1),
        name: args.name,
        email: args.email,
        age: args.age,
      };

      customers.push(newCustomer);

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

      return deletedCustomerId;
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
