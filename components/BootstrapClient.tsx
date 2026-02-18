'use client';
import { useEffect } from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
      .catch(err => console.error('Bootstrap JS failed to load', err));
  }, []);

  return null;
}