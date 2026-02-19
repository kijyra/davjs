import { apiFetch } from '@/services/api';
import ViewClient from './ViewClient';

interface PageProps {
  searchParams: Promise<{ buildingId?: string; floorId?: string }>;
}

export default async function ViewPage({ searchParams }: PageProps) {
  const { buildingId, floorId } = await searchParams;

  let endpoint = '/view/Data';
  const params = new URLSearchParams();
  if (buildingId) params.append('buildingId', buildingId);
  if (floorId) params.append('floorId', floorId);
  const queryString = params.toString();
  if (queryString) endpoint += `?${queryString}`;

  const data = await apiFetch<{
    buildings: { id: number; name: string }[];
    selectedBuilding: any;
    selectedFloor: any;
  }>(endpoint);

  return <ViewClient {...data} />;
}