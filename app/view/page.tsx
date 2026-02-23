'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '@/services/api';
import ViewClient from './ViewClient';

interface ViewData {
  buildings: { id: number; name: string }[];
  selectedBuilding: any;
  selectedFloor: any;
}

export default function ViewPage() {
  const searchParams = useSearchParams();
  const buildingId = searchParams.get('buildingId');
  const floorId = searchParams.get('floorId');

  const [data, setData] = useState<ViewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (buildingId) params.append('buildingId', buildingId);
        if (floorId) params.append('floorId', floorId);
        const query = params.toString() ? `?${params.toString()}` : '';
        const result = await apiFetch<ViewData>(`/api/view/data${query}`, { cache: 'no-store' });
        setData(result);
      } catch (err) {
        setError('Ошибка загрузки данных');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [buildingId, floorId]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return <div>Нет данных</div>;

  return <ViewClient {...data} />;
}