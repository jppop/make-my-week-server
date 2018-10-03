// @flow
import { ApolloServer, gql } from 'apollo-server-express';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { merge } from 'lodash';

import { data, createProject } from './data';

const customScalars = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),
};

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  scalar Date

  type User {
    id: ID!
    username: String!
    fullName: String!
    email: String!
  }

  # This "Project" type can be used in other type declarations.
  type Project {
    id: ID!
    name: String!
    label: String!
    tasks: [Task]!
  }

  type Task {
    id: ID!
    name: String
    label: String
    color: String
    project: Project
    owner: User!
    planned: Float
    completed: Float
  }

  type Work {
    id: ID!
    label: String
    project: Project!
    task: Task!
    start: Date!
    end: Date!
    lunchTime: Boolean
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    projects: [Project]!
    project(id: ID!): Project!
    projectByName(name: String!): Project
    tasks: [Task]!
    task(id: ID!): Task!
    works: [Work]!
    work(id: ID!): Work!
    users: [User]!
  }

  type Mutation {
    createProject: Project!
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = merge(customScalars, {
  Query: {
    projects: () => Object.values(data.projects),
    project: (parent, { id }) => data.projects.find(p => p.id === id),
    projectByName: (parent, { name }) => data.projects.find(p => p.name === name),
    tasks: () => Object.values(data.tasks),
    task: (parent, { id }) => data.tasks.find(t => t.id === id),
    works: () => Object.values(data.works),
    work: (parent, { id }) => data.works.find(w => w.id === id),
    users: () => Object.values(data.users),
  },
  Project: {
    tasks: project => Object.values(data.tasks.filter(t => t.projectId === project.id)),
  },
  Task: {
    project: task => data.projects.find(p => p.id === task.projectId),
    owner: task => data.users.find(u => u.id === task.ownerId),
  },
  Work: {
    project: work => data.projects.find(p => p.id === work.projectId),
    task: work => data.tasks.find(t => t.id === work.taskId),
  },
  Mutation: {
    createProject: () => createProject(),
  },
});

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const dataServer = new ApolloServer({ typeDefs, resolvers });

export default dataServer;
