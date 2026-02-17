'use client';
import { useState } from 'react';
import { apiFetch } from '@/services/api';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: string;
  initialSettings?: {
    pc: string;
    thin: string;
  };
}

export default function UserSettingsModal({ isOpen, onClose, currentUser, initialSettings }: UserSettingsModalProps) {
  const [pcConn, setPcConn] = useState(initialSettings?.pc || 'VNC10');
  const [thinConn, setThinConn] = useState(initialSettings?.thin || 'WTRC');

  if (!isOpen) return null;

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await apiFetch('/api/home/settings', {
      method: 'POST',
      body: JSON.stringify({
        DefaultPCConnection: pcConn,
        ThinkConnection: thinConn
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response) {
      console.log('Настройки сохранены успешно');
      onClose();
      window.location.reload(); 
    }
  } catch (error) {
    console.error('Ошибка при сохранении настроек:', error);
    alert('Не удалось сохранить настройки');
  }
};

  return (
    <>
      <div 
        className="modal-backdrop fade show" 
        style={{ zIndex: 1070, backdropFilter: 'blur(4px)', opacity: 0.5 }} 
        onClick={onClose}
      />
      
      <div className="modal fade show d-block" style={{ zIndex: 1075 }} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg bg-body">
            <form onSubmit={handleSubmit}>
              <div className="modal-header border-bottom-0 pt-4 px-4">
                <h5 className="modal-title fw-bold">
                  Настройки: <span className="text-primary">{currentUser.split('\\').pop()}</span>
                </h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
              </div>

              <div className="modal-body px-4">
                {/* Вне домена (PC) */}
                <div className="form-floating mb-3">
                  <select 
                    className="form-select border-secondary-subtle bg-body-tertiary" 
                    value={pcConn}
                    onChange={(e) => setPcConn(e.target.value)}
                  >
                    <option value="Any">AnyDesk (Автоматически)</option>
                    <option value="VNC00">VNC: Только просмотр</option>
                    <option value="VNC01">VNC: Только просмотр (скрыто)</option>
                    <option value="VNC10">VNC: Полный доступ</option>
                    <option value="VNC11">VNC: Полный доступ (скрыто)</option>
                  </select>
                  <label className="small opacity-75">Подключение к ПК (Вне домена)</label>
                </div>

                {/* Тонкие клиенты */}
                <div className="form-floating mb-3">
                  <select 
                    className="form-select border-secondary-subtle bg-body-tertiary"
                    value={thinConn}
                    onChange={(e) => setThinConn(e.target.value)}
                  >
                    <option value="VNC00">VNC: Только просмотр с запросом</option>
                    <option value="VNC10">VNC: Полный доступ с запросом</option>
                    <option value="WTRC">WTRC (Утилита)</option>
                    <option value="WEB">Открыть Web-панель</option>
                  </select>
                  <label className="small opacity-75">Тонкие клиенты</label>
                </div>

                <div className="alert alert-info py-2 px-3 small border-0 bg-info-subtle text-info-emphasis">
                  <i className="bi bi-info-circle me-2"></i>
                  Эти настройки влияют на метод открытия ссылок в один клик.
                </div>
              </div>

              <div className="modal-footer border-0 pb-4">
                <button type="button" className="btn btn-secondary btn-sm px-3" onClick={onClose}>
                  Отмена
                </button>
                <button type="submit" className="btn btn-primary btn-sm px-4 fw-medium">
                  Сохранить изменения
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
