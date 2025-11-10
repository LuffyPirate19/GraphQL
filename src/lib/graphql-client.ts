const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';

interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{ message: string; path?: string[] }>;
}

interface GraphQLRequest {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
}

class GraphQLClient {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTTL = 60000; // 1 minute
  private pendingRequests: Map<string, Promise<GraphQLResponse>> = new Map();

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private getCacheKey(query: string, variables?: Record<string, any>): string {
    // Normalize variables by sorting keys to ensure consistent cache keys
    const normalizedVars = variables 
      ? JSON.stringify(variables, Object.keys(variables).sort())
      : '{}';
    return `${query}:${normalizedVars}`;
  }

  async request<T = any>({ query, variables, operationName }: GraphQLRequest): Promise<GraphQLResponse<T>> {
    const cacheKey = this.getCacheKey(query, variables);
    const isMutation = query.trim().startsWith('mutation');
    
    // Check cache (only for queries, not mutations, and only if not network-only)
    if (!isMutation) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        return { data: cached.data };
      }
    }

    // Check if there's already a pending request for this exact query
    if (!isMutation && this.pendingRequests.has(cacheKey)) {
      const pendingRequest = this.pendingRequests.get(cacheKey);
      if (pendingRequest) {
        return pendingRequest as Promise<GraphQLResponse<T>>;
      }
    }

    // Create the request with timeout
    const requestPromise = (async () => {
      let timeoutId: NodeJS.Timeout | null = null;
      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await fetch(GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            query,
            variables,
            operationName,
          }),
          signal: controller.signal,
        });
        
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: GraphQLResponse<T> = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0]?.message || 'GraphQL error');
        }

        // Cache successful queries (not mutations)
        if (result.data && !isMutation) {
          this.cache.set(cacheKey, {
            data: result.data,
            timestamp: Date.now(),
          });
        }

        return result;
      } catch (error: any) {
        // Clear timeout if still active
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        // Remove from pending requests on error
        if (!isMutation) {
          this.pendingRequests.delete(cacheKey);
        }
        
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
          throw new Error('Request timeout');
        }
        
        throw new Error(error.message || 'Network error');
      } finally {
        // Remove from pending requests when done
        if (!isMutation) {
          this.pendingRequests.delete(cacheKey);
        }
      }
    })();

    // Store pending request for deduplication (only for queries)
    if (!isMutation) {
      this.pendingRequests.set(cacheKey, requestPromise);
    }

    return requestPromise;
  }

  clearCache() {
    this.cache.clear();
  }

  refetchQueries(queries?: string[]) {
    if (queries) {
      // Clear specific queries by checking if the cache key contains the query string
      for (const [key] of this.cache.entries()) {
        // Cache key format is: "query:variables"
        // Check if any of the provided queries match
        if (queries.some(q => key.includes(q))) {
          this.cache.delete(key);
        }
      }
    } else {
      this.clearCache();
    }
  }
}

export const graphqlClient = new GraphQLClient();

