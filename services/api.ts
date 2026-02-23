const isServer = typeof window === 'undefined';

const baseURL = isServer
  ? (process.env.API_BASE_URL_SERVER || 'https://dc1.dallari.biz:3001')
  : '';

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = baseURL
    ? `${baseURL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`
    : endpoint;

  const defaultOptions: RequestInit = {
    credentials: isServer ? undefined : 'include',
    ...options,
  };

  const response = await fetch(url, defaultOptions);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}