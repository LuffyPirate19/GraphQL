import { gql } from 'graphql-tag';

export const cartTypeDefs = gql`
  type Cart {
    id: ID!
    userId: ID!
    items: [CartItem!]!
    updatedAt: DateTime!
  }

  type CartItem {
    id: ID!
    productId: ID!
    product: Product
    quantity: Int!
  }
`;


