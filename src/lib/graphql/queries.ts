export const GET_PRODUCTS = `
  query GetProducts(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $limit: Int
    $offset: Int
    $filter: ProductFilter
    $sort: SortInput
  ) {
    products(
      first: $first
      after: $after
      last: $last
      before: $before
      limit: $limit
      offset: $offset
      filter: $filter
      sort: $sort
    ) {
      edges {
        node {
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
          categoryId
          inStock
          stockQuantity
          rating
          reviewCount
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        totalCount
      }
    }
  }
`;

export const GET_PRODUCT = `
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
        slug
      }
      categoryId
      inStock
      stockQuantity
      rating
      reviewCount
      reviews(first: 10) {
        edges {
          node {
            id
            rating
            comment
            user {
              id
              name
            }
            createdAt
          }
        }
        totalCount
      }
    }
  }
`;

export const GET_CATEGORIES = `
  query GetCategories {
    categories {
      id
      name
      description
    }
  }
`;

export const GET_ORDERS = `
  query GetOrders($filter: OrderFilter, $first: Int, $after: String, $limit: Int, $offset: Int) {
    orders(filter: $filter, first: $first, after: $after, limit: $limit, offset: $offset) {
      edges {
        node {
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
            name
          }
        }
      }
      pageInfo {
        totalCount
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_CART = `
  query GetCart {
    cart {
      id
      items {
        id
        product {
          id
          name
          price
          image
        }
        quantity
      }
    }
  }
`;

export const GET_ME = `
  query GetMe {
    me {
      id
      email
      name
      role
    }
  }
`;
