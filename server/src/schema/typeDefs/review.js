import { gql } from 'graphql-tag';

export const reviewTypeDefs = gql`
  type Review {
    id: ID!
    productId: ID!
    product: Product
    userId: ID!
    user: User
    rating: Int!
    comment: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type ReviewEdge {
    node: Review!
    cursor: String!
  }

  type ReviewConnection {
    edges: [ReviewEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  input CreateReviewInput {
    productId: ID!
    rating: Int!
    comment: String
  }
`;




