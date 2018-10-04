import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    task(id: ID!): Task
    tasks: [Task!]
  }

  type Task {
    id: ID!
    name: String
    label: String
    color: String
    project: Project
    planned: Float
    completed: Float
  }
`;
