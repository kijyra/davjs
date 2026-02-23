'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';
import ViewClient from './ViewClient';

interface ViewData {
  buildings: { id: number; name: string }[];
  selectedBuilding: any;
  selectedFloor: any;
}

export default function ViewPage() {
  const [data, setData] = useState<ViewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<ViewData>('/api/view/data', { cache: 'no-store' })
      .then((data) => setData(data))
      .catch((err) => {
        console.error(err);
        setError('Ошибка загрузки данных');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return <div>Нет данных</div>;

  return <ViewClient {...data} />;
}