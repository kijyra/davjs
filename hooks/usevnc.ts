import { useState } from 'react';
import { toast } from 'react-toastify';
import { apiFetch } from '@/services/api';

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
    requestUser: boolean
  ) => {
    if (loading) return;
    setLoading(true);

    const infoToast = toast.info("Проверка доступа...", { autoClose: false });

    try {
      const queryParams = new URLSearchParams({
        pcId: pcId.toString(),
        fullControl: fullControl.toString(),
        requestUser: requestUser.toString()
      });
      const endpoint = `/api/VNC/Connect?${queryParams}`;

      const result = await apiFetch<VncResponse>(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
      });

      toast.dismiss(infoToast);

      if (result.uri) {
        toast.success(result.message || "Успешно");
        window.location.href = result.uri;
      } else {
        toast.error("Сервер не вернул адрес подключения");
      }
    } catch (error: any) {
      toast.dismiss(infoToast);
      console.error("VNC Error:", error);
      const errorMessage = error?.message || "Неизвестная ошибка";
      toast.error(`Ошибка: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return { connectVnc, loading };
};