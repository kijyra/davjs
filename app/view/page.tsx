import { apiFetch } from '@/services/api';
import ViewClient from './ViewClient';

interface PageProps {
  searchParams: Promise<{ buildingId?: string; floorId?: string }>;
}

export default async function ViewPage({ searchParams }: PageProps) {
  const { buildingId, floorId } = await searchParams;

  const url = new URL('/view/Data');
  if (buildingId) url.searchParams.append('buildingId', buildingId);
  if (floorId) url.searchParams.append('floorId', floorId);

  const data = await apiFetch<{
    buildings: { id: number; name: string }[];
    selectedBuilding: any;
    selectedFloor: any;
  }>(url.toString());

  return <ViewClient {...data} />;
}