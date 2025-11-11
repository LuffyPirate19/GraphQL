import { GraphQLError } from 'graphql';

/**
 * Custom error classes
 */
export class AuthenticationError extends GraphQLError {
  constructor(message = 'Authentication required') {
    super(message, {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    });
  }
}

export class AuthorizationError extends GraphQLError {
  constructor(message = 'Not authorized') {
    super(message, {
      extensions: {
        code: 'FORBIDDEN',
        http: { status: 403 },
      },
    });
  }
}

export class ValidationError extends GraphQLError {
  constructor(message, field = null) {
    super(message, {
      extensions: {
        code: 'BAD_USER_INPUT',
        http: { status: 400 },
        field,
      },
    });
  }
}

export class NotFoundError extends GraphQLError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, {
      extensions: {
        code: 'NOT_FOUND',
        http: { status: 404 },
      },
    });
  }
}

export class ConflictError extends GraphQLError {
  constructor(message = 'Resource already exists') {
    super(message, {
      extensions: {
        code: 'CONFLICT',
        http: { status: 409 },
      },
    });
  }
}

export class InternalServerError extends GraphQLError {
  constructor(message = 'Internal server error') {
    super(message, {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        http: { status: 500 },
      },
    });
  }
}

/**
 * Format error for GraphQL response
 */
export const formatError = (error) => {
  // If it's already a GraphQLError with extensions, return as is
  if (error.extensions) {
    return error;
  }

  // Log unexpected errors
  console.error('Unexpected error:', error);

  // Return generic error for unexpected errors
  return new GraphQLError(error.message || 'An unexpected error occurred', {
    extensions: {
      code: 'INTERNAL_SERVER_ERROR',
      http: { status: 500 },
    },
    originalError: error,
  });
};




