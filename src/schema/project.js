import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    projects: [Project]!
    project(id: ID!): Project!
    projectByName(name: String!): Project
  }

  extend type Mutation {
    createProject: Project!
  }

  type Project {
    id: ID!
    name: String!
    label: String!
    tasks: [Task]!
    createdAt: Date
    updatedAt: Date
  }
`;
