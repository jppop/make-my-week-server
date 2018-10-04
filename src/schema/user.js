import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    user(id: ID!): User
    users: [User!]
  }

  type Token {
    token: String!
  }

  type User {
    id: ID!
    username: String!
    fullName: String!
    email: String!
    createdAt: Date
    updatedAt: Date
  }
`;
