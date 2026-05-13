import type { ApiEndpointWithBody } from '@repo/api-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Helper type that represents either an endpoint with or without a body
 * Since ApiEndpointWithBody extends ApiEndpoint, we can use it for both cases
 */
type FetchEndpoint<TResponse> = ApiEndpointWithBody<unknown, TResponse>;

export type ClientFetchOptions<TResult> = {
  /**
   * Full control over status codes and body shape. When set, the default
   * “throw if !ok + JSON parse” path is skipped.
   */
  parseResponse: (response: Response) => Promise<TResult>;
};

/**
 * Client-side fetch for use with TanStack Query (no Next fetch cache).
 *
 * Pass {@link ClientFetchOptions.parseResponse} when the caller needs
 * non-2xx handling without throwing (e.g. validation errors with typed results).
 */
export async function clientFetch<
  TEndpointResponse,
  TResult = TEndpointResponse,
>(
  endpoint: FetchEndpoint<TEndpointResponse>,
  options?: ClientFetchOptions<TResult>,
): Promise<TResult> {
  const { url, method } = endpoint;
  const body = 'body' in endpoint ? endpoint.body : undefined;

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (options?.parseResponse) {
    return options.parseResponse(response);
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as TResult;
}
