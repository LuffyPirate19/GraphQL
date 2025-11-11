/**
 * Create cursor from document
 */
export const createCursor = (document) => {
  if (!document || !document._id) return null;
  return Buffer.from(document._id.toString()).toString('base64');
};

/**
 * Decode cursor to ObjectId
 */
export const decodeCursor = (cursor) => {
  try {
    if (!cursor) return null;
    const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Create page info for Relay-style connections
 */
export const createPageInfo = (edges, hasNextPage, hasPreviousPage, totalCount) => {
  return {
    hasNextPage: hasNextPage || false,
    hasPreviousPage: hasPreviousPage || false,
    startCursor: edges.length > 0 ? edges[0].cursor : null,
    endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
    totalCount: totalCount || 0,
  };
};

/**
 * Apply pagination to MongoDB query
 */
export const applyPagination = (query, { first, after, last, before, limit, offset }) => {
  let paginatedQuery = query;

  // Cursor-based pagination (Relay-style)
  if (first || last) {
    const limitValue = first || last || 10;
    
    if (after) {
      const cursorId = decodeCursor(after);
      if (cursorId) {
        paginatedQuery = paginatedQuery.where('_id').gt(cursorId);
      }
    }
    
    if (before) {
      const cursorId = decodeCursor(before);
      if (cursorId) {
        paginatedQuery = paginatedQuery.where('_id').lt(cursorId);
      }
    }

    paginatedQuery = paginatedQuery.limit(limitValue + 1); // Fetch one extra to determine hasNextPage
  }
  // Offset-based pagination
  else if (limit !== undefined || offset !== undefined) {
    const limitValue = limit || 10;
    const offsetValue = offset || 0;
    paginatedQuery = paginatedQuery.skip(offsetValue).limit(limitValue);
  }
  // Default pagination
  else {
    paginatedQuery = paginatedQuery.limit(10);
  }

  return paginatedQuery;
};

/**
 * Determine if there's a next page
 */
export const hasNextPage = (results, limit) => {
  if (results.length > limit) {
    results.pop(); // Remove the extra item
    return true;
  }
  return false;
};

/**
 * Determine if there's a previous page
 */
export const hasPreviousPage = (offset) => {
  return offset > 0;
};




