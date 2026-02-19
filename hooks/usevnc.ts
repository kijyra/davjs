import { useState } from 'react';
import { toast } from 'react-toastify';

interface VncResponse {
  success?: boolean;
  message?: string;
  uri?: string;
}

export const useVnc = () => {
  const [loading, setLoading] = useState(false);

  const connectVnc = async (
    pcId: number,
    ip: string,
    fullControl: boolean,
    requestUser: boolean,
    btnElement?: HTMLElement | null
  ) => {
    if (loading) return;
    setLoading(true);

    const originalText = btnElement?.innerHTML;
    if (btnElement) {
      btnElement.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
      (btnElement as HTMLButtonElement).disabled = true;
    }

    toast.info("Проверка доступа...", { toastId: 'vnc-info' });

    try {
      const url = `/VNC/Connect?pcId=${pcId}&fullControl=${fullControl}&requestUser=${!!requestUser}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
      });
      const result: VncResponse = await response.json();

      if (response.ok) {
        toast.success(result.message || "Успешно", { toastId: 'vnc-success' });
        if (result.uri) {
          window.location.href = result.uri;
        }
      } else {
        toast.error(result.message || `Ошибка сервера: ${response.status}`, { toastId: 'vnc-error' });
      }
    } catch (error) {
      console.error("VNC JS Error:", error);
      toast.error("Сетевая ошибка: проверьте соединение с сервером", { toastId: 'vnc-critical' });
    } finally {
      setLoading(false);
      if (btnElement) {
        btnElement.innerHTML = originalText || '';
        (btnElement as HTMLButtonElement).disabled = false;
      }
    }
  };

  return { connectVnc, loading };
};