import { gql } from 'graphql-tag';

export const orderTypeDefs = gql`
  type Order {
    id: ID!
    userId: ID!
    user: User
    status: OrderStatus!
    items: [OrderItem!]!
    total: Decimal!
    shippingAddress: ShippingAddress
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type OrderItem {
    id: ID!
    productId: ID!
    product: Product
    quantity: Int!
    price: Decimal!
    name: String!
  }

  type OrderEdge {
    node: Order!
    cursor: String!
  }

  type OrderConnection {
    edges: [OrderEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type ShippingAddress {
    street: String
    city: String
    state: String
    zipCode: String
    country: String
  }

  enum OrderStatus {
    pending
    processing
    shipped
    delivered
    cancelled
  }

  input CreateOrderInput {
    items: [OrderItemInput!]!
    shippingAddress: ShippingAddressInput
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
  }

  input ShippingAddressInput {
    street: String
    city: String
    state: String
    zipCode: String
    country: String
  }

  input OrderFilter {
    userId: ID
    status: OrderStatus
    dateRange: DateRange
  }

  input DateRange {
    from: DateTime
    to: DateTime
  }
`;



