const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dc1.dallari.biz:3001';

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  const url = `${cleanBaseUrl}${cleanEndpoint}`;

  console.log('🚀 API Fetching URL:', url); 

  const defaultOptions: RequestInit = {
    credentials: 'include',
    ...options,
  };

  const response = await fetch(url, defaultOptions);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
