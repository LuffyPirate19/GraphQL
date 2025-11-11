import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { graphqlClient } from '@/lib/graphql-client';

interface UseQueryOptions {
  variables?: Record<string, any>;
  skip?: boolean;
  fetchPolicy?: 'cache-first' | 'network-only' | 'cache-and-network';
}

interface UseQueryResult<T = any> {
  data: T | undefined;
  loading: boolean;
  error: Error | undefined;
  refetch: () => Promise<{ data: T | undefined }>;
}

export function useQuery<T = any>(
  query: string,
  options: UseQueryOptions = {}
): UseQueryResult<T> {
  const { variables, skip = false, fetchPolicy = 'cache-first' } = options;
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<Error | undefined>(undefined);
  
  // Use ref to track if component is mounted
  const isMountedRef = useRef(true);
  
  // Stabilize variables by stringifying them for comparison
  const variablesString = useMemo(() => JSON.stringify(variables || {}), [variables]);
  const stableVariables = useMemo(() => variables || {}, [variablesString]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const executeQuery = useCallback(async () => {
    if (skip || !isMountedRef.current) {
      if (isMountedRef.current) {
        setLoading(false);
      }
      return;
    }

    if (!isMountedRef.current) return;

    setLoading(true);
    setError(undefined);

    try {
      // Clear cache if network-only
      if (fetchPolicy === 'network-only') {
        graphqlClient.clearCache();
      }

      const result = await graphqlClient.request({
        query,
        variables: stableVariables,
      });

      if (!isMountedRef.current) return;

      if (result.data) {
        setData(result.data as T);
      }
    } catch (err: any) {
      if (!isMountedRef.current) return;
      
      setError(err);
      setData(undefined);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, variablesString, skip, fetchPolicy]);

  // Only run query when query string or variables actually change
  useEffect(() => {
    executeQuery();
  }, [query, variablesString, skip, fetchPolicy]);

  const refetch = useCallback(async () => {
    if (!isMountedRef.current) {
      return { data: undefined };
    }
    
    graphqlClient.clearCache();
    setLoading(true);
    setError(undefined);
    
    try {
      const result = await graphqlClient.request({
        query,
        variables: stableVariables,
      });
      
      if (!isMountedRef.current) {
        return { data: undefined };
      }
      
      if (result.data) {
        setData(result.data as T);
        return { data: result.data as T };
      }
      return { data: undefined };
    } catch (err: any) {
      if (!isMountedRef.current) {
        return { data: undefined };
      }
      
      setError(err);
      setData(undefined);
      return { data: undefined };
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [query, variablesString]);

  return { data, loading, error, refetch };
}

interface UseMutationOptions {
  onCompleted?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseMutationResult<T = any> {
  mutate: (variables?: Record<string, any>) => Promise<T | undefined>;
  loading: boolean;
  error: Error | undefined;
  data: T | undefined;
}

export function useMutation<T = any>(
  mutation: string,
  options: UseMutationOptions = {}
): UseMutationResult<T> {
  const { onCompleted, onError } = options;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [data, setData] = useState<T | undefined>(undefined);

  const mutate = useCallback(
    async (variables?: Record<string, any>) => {
      setLoading(true);
      setError(undefined);
      setData(undefined);

      try {
        const result = await graphqlClient.request<T>({
          query: mutation,
          variables,
        });

        if (result.errors) {
          // Handle errors array or errors object
          let errorMessage = 'Mutation failed';
          if (Array.isArray(result.errors) && result.errors.length > 0) {
            errorMessage = result.errors[0]?.message || errorMessage;
          } else if (result.errors && typeof result.errors === 'object') {
            // Handle errors as object (e.g., {0: {message: "..."}})
            const firstError = Object.values(result.errors)[0] as any;
            errorMessage = firstError?.message || errorMessage;
          }
          throw new Error(errorMessage);
        }

        if (result.data) {
          setData(result.data);
          onCompleted?.(result.data);
          // Clear cache after mutation
          graphqlClient.clearCache();
        }

        return result.data;
      } catch (err: any) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [mutation, onCompleted, onError]
  );

  return { mutate, loading, error, data };
}

