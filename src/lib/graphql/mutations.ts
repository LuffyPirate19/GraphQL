export const CREATE_ORDER = `
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      status
      total
      createdAt
    }
  }
`;

export const ADD_TO_CART = `
  mutation AddToCart($productId: ID!, $quantity: Int!) {
    addToCart(productId: $productId, quantity: $quantity) {
      id
      items {
        id
        product {
          id
          name
          price
        }
        quantity
      }
    }
  }
`;

export const CREATE_PRODUCT = `
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
      price
      image
      categoryId
      inStock
    }
  }
`;

export const UPDATE_PRODUCT = `
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      description
      price
      image
      categoryId
      inStock
    }
  }
`;

export const DELETE_PRODUCT = `
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      success
    }
  }
`;

export const UPDATE_ORDER_STATUS = `
  mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const REMOVE_FROM_CART = `
  mutation RemoveFromCart($productId: ID!) {
    removeFromCart(productId: $productId) {
      id
      items {
        id
        product {
          id
          name
          price
        }
        quantity
      }
    }
  }
`;

export const UPDATE_CART_ITEM = `
  mutation UpdateCartItem($productId: ID!, $quantity: Int!) {
    updateCartItem(productId: $productId, quantity: $quantity) {
      id
      items {
        id
        product {
          id
          name
          price
        }
        quantity
      }
    }
  }
`;

export const LOGIN = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
        name
        role
      }
      token
    }
  }
`;

export const REGISTER = `
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        email
        name
        role
      }
      token
    }
  }
`;

export const CREATE_CATEGORY = `
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
      description
      slug
    }
  }
`;

export const UPDATE_CATEGORY = `
  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      description
      slug
    }
  }
`;

export const DELETE_CATEGORY = `
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      success
    }
  }
`;
