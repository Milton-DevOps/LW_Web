/**
 * Centralized fetch helper with credentials support
 * This ensures all API calls include credentials for CORS
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function fetchAPI(
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Prepare headers - ensure Content-Type is only set if we have a body
  const headers: Record<string, string> = {
    ...options.headers,
  };
  
  // Only set Content-Type if we have a body and it's not already set
  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const defaultOptions: FetchOptions = {
    credentials: 'include', // Include cookies in CORS requests
    headers,
    ...options,
  };

  try {
    console.log(`[FETCH] ${options.method || 'GET'} ${url}`, {
      hasBody: !!defaultOptions.body,
      hasAuth: !!headers['Authorization'],
      contentType: headers['Content-Type']
    });
    const response = await fetch(url, defaultOptions);
    
    // Log response status for debugging
    if (!response.ok) {
      console.warn(`[FETCH] Error: ${response.status} ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    console.error(`[FETCH] Network error: ${error}`);
    throw error;
  }
}

/**
 * GET request helper
 */
export async function getFetch(endpoint: string, options: FetchOptions = {}) {
  const response = await fetchAPI(endpoint, {
    method: 'GET',
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to fetch data');
  }

  return response.json();
}

/**
 * POST request helper
 */
export async function postFetch(
  endpoint: string,
  data?: any,
  options: FetchOptions = {}
) {
  const response = await fetchAPI(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to post data');
  }

  return response.json();
}

/**
 * PUT request helper
 */
export async function putFetch(
  endpoint: string,
  data?: any,
  options: FetchOptions = {}
) {
  const response = await fetchAPI(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update data');
  }

  return response.json();
}

/**
 * DELETE request helper
 */
export async function deleteFetch(endpoint: string, options: FetchOptions = {}) {
  const response = await fetchAPI(endpoint, {
    method: 'DELETE',
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to delete data');
  }

  return response.json();
}

/**
 * PATCH request helper
 */
export async function patchFetch(
  endpoint: string,
  data?: any,
  options: FetchOptions = {}
) {
  const response = await fetchAPI(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to patch data');
  }

  return response.json();
}
