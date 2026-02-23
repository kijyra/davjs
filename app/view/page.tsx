'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/services/api';
import ViewClient from './ViewClient';

interface ViewData {
  buildings: { id: number; name: string }[];
  selectedBuilding: any;
  selectedFloor: any;
}

export default function ViewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buildingId = searchParams.get('buildingId');
  const floorId = searchParams.get('floorId');

  const [data, setData] = useState<ViewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (buildingId) params.append('buildingId', buildingId);
    if (floorId) params.append('floorId', floorId);
    const query = params.toString() ? `?${params.toString()}` : '';

    apiFetch<ViewData>(`/api/view/data${query}`, { cache: 'no-store' })
      .then(setData)
      .catch(err => {
        console.error(err);
        setError('Ошибка загрузки данных');
      })
      .finally(() => setLoading(false));
  }, [buildingId, floorId]);

  // Автовыбор первого здания, если нет параметра buildingId
  useEffect(() => {
    if (data && data.buildings.length > 0 && !buildingId) {
      const firstBuildingId = data.buildings[0].id;
      router.push(`/view?buildingId=${firstBuildingId}`);
    }
  }, [data, buildingId, router]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return <div>Нет данных</div>;

  return <ViewClient {...data} />;
}