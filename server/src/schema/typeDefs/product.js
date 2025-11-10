import { gql } from 'graphql-tag';

export const productTypeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String
    price: Decimal!
    images: [String!]!
    image: String
    category: Category
    categoryId: ID!
    inStock: Boolean!
    stockQuantity: Int!
    attributes: JSON
    rating: Float!
    reviewCount: Int!
    reviews(first: Int, after: String): ReviewConnection
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type ProductEdge {
    node: Product!
    cursor: String!
  }

  type ProductConnection {
    edges: [ProductEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
    totalCount: Int!
  }

  input ProductFilter {
    categoryIds: [ID!]
    priceRange: PriceRange
    inStock: Boolean
    search: String
    attributes: JSON
    AND: [ProductFilter!]
    OR: [ProductFilter!]
  }

  input PriceRange {
    min: Decimal
    max: Decimal
  }

  input CreateProductInput {
    name: String!
    description: String
    price: Decimal!
    images: [String!]
    image: String
    categoryId: ID!
    inStock: Boolean
    stockQuantity: Int
    attributes: JSON
  }

  input UpdateProductInput {
    name: String
    description: String
    price: Decimal
    images: [String!]
    image: String
    categoryId: ID
    inStock: Boolean
    stockQuantity: Int
    attributes: JSON
  }

  input SortInput {
    sortBy: String
  }

  scalar JSON
`;



