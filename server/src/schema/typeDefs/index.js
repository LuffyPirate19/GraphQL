import { gql } from 'graphql-tag';
import { scalarTypeDefs } from './scalar.js';
import { productTypeDefs } from './product.js';
import { categoryTypeDefs } from './category.js';
import { orderTypeDefs } from './order.js';
import { userTypeDefs } from './user.js';
import { cartTypeDefs } from './cart.js';
import { reviewTypeDefs } from './review.js';

const rootTypeDefs = gql`
  type Query {
    # Products
    products(
      filter: ProductFilter
      first: Int
      after: String
      last: Int
      before: String
      limit: Int
      offset: Int
      sort: SortInput
    ): ProductConnection!
    product(id: ID!): Product

    # Categories
    categories: [Category!]!
    category(id: ID!): Category

    # Orders
    orders(
      filter: OrderFilter
      first: Int
      after: String
      limit: Int
      offset: Int
    ): OrderConnection!
    order(id: ID!): Order

    # Cart
    cart: Cart

    # User
    me: User
  }

  type Mutation {
    # Authentication
    login(input: LoginInput!): AuthPayload!
    register(input: RegisterInput!): AuthPayload!

    # Cart
    addToCart(productId: ID!, quantity: Int!): Cart!
    removeFromCart(productId: ID!): Cart!

    # Orders
    createOrder(input: CreateOrderInput!): Order!
    updateOrderStatus(id: ID!, status: OrderStatus!): Order!

    # Products (Admin only)
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): DeleteResponse!

    # Categories (Admin only)
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): DeleteResponse!
  }

  type DeleteResponse {
    success: Boolean!
  }
`;

export const typeDefs = [
  rootTypeDefs,
  scalarTypeDefs,
  productTypeDefs,
  categoryTypeDefs,
  orderTypeDefs,
  userTypeDefs,
  cartTypeDefs,
  reviewTypeDefs,
];


