import { apiFetch } from '@/services/api';
import ViewClient from './ViewClient';
import { headers } from 'next/headers';

interface PageProps {
  searchParams: Promise<{ buildingId?: string; floorId?: string }>;
}

export default async function ViewPage({ searchParams }: PageProps) {
  const { buildingId, floorId } = await searchParams;

  const params = new URLSearchParams();
  if (buildingId) params.append('buildingId', buildingId);
  if (floorId) params.append('floorId', floorId);
  
  const queryString = params.toString();
  const endpoint = `/api/view/Data${queryString ? `?${queryString}` : ''}`;

  const clientHeaders = await headers();
  const cookie = clientHeaders.get('cookie') || '';

  try {
    const data = await apiFetch<{
      buildings: { id: number; name: string }[];
      selectedBuilding: any;
      selectedFloor: any;
    }>(endpoint, {
      headers: {
        'Cookie': cookie,
      },
      cache: 'no-store', 
    });

    return <ViewClient {...data} />;
  } catch (error) {
    console.error("Failed to fetch data in ViewPage:", error);
    return <div>Ошибка загрузки данных. Проверьте соединение с API.</div>;
  }
}
