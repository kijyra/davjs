import { apiFetch } from '@/services/api';

export async function getTableData(tableName: string) {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const headers: HeadersInit = {};
  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }

  return apiFetch<any[]>(`/Admin/GetTableData?tableName=${tableName}`, { headers });
}