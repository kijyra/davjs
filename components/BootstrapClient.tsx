// BootstrapClient.tsx
'use client';
import { useEffect } from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    // Динамический импорт для избежания SSR
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
      .catch(err => console.error('Bootstrap JS failed to load', err));
  }, []);

  return null;
}