import { gql } from 'graphql-tag';

export const userTypeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    role: UserRole!
    orders(filter: OrderFilter, first: Int, after: String): OrderConnection
    createdAt: DateTime!
  }

  enum UserRole {
    customer
    admin
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    email: String!
    password: String!
    name: String!
  }
`;




