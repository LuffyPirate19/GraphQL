import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts($limit: Int, $offset: Int, $categoryIds: [ID], $minPrice: Float, $maxPrice: Float, $search: String, $sortBy: String) {
    products(limit: $limit, offset: $offset, categoryIds: $categoryIds, minPrice: $minPrice, maxPrice: $maxPrice, search: $search, sortBy: $sortBy) {
      edges {
        node {
          id
          name
          description
          price
          image
          category {
            id
            name
          }
          inStock
          rating
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        totalCount
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      image
      images
      category {
        id
        name
      }
      inStock
      rating
      reviews {
        id
        rating
        comment
        user {
          id
          name
        }
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      description
    }
  }
`;

export const GET_ORDERS = gql`
  query GetOrders($userId: ID) {
    orders(userId: $userId) {
      id
      status
      total
      createdAt
      items {
        id
        product {
          id
          name
          image
        }
        quantity
        price
      }
    }
  }
`;
