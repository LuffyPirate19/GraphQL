import { gql } from 'graphql-tag';

export const categoryTypeDefs = gql`
  type Category {
    id: ID!
    name: String!
    description: String
    slug: String!
    image: String
    products(filter: ProductFilter, first: Int, after: String, sort: SortInput): ProductConnection
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateCategoryInput {
    name: String!
    description: String
    image: String
  }

  input UpdateCategoryInput {
    name: String
    description: String
    image: String
  }
`;




