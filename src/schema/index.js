import { gql } from 'apollo-server-express';

import userSchema from './user';
import projectSchema from './project';
import taskSchema from './task';

const linkSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String!
  }
`;

export default [linkSchema, userSchema, projectSchema, taskSchema];
