'use client';

import { useState } from 'react';
import { apiFetch } from '@/services/api';

interface ADUserUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultIdentity?: string;
}

export default function ADUserUpdateModal({
  isOpen,
  onClose,
  onSuccess,
  defaultIdentity = 'dallari\\',
}: ADUserUpdateModalProps) {
  const [identityName, setIdentityName] = useState(defaultIdentity);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('IdentityName', identityName);

    try {
      const response = await apiFetch<{ success: boolean; message?: string }>('/api/User/ADUser/Update', {
        method: 'POST',
        body: formData,
      });

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.message || 'Ошибка при обновлении');
      }
    } catch (err) {
      setError('Не удалось выполнить запрос');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ zIndex: 1090 }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Обновление пользователя</h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="bi bi-people"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="IdentityName"
                  value={identityName}
                  onChange={(e) => setIdentityName(e.target.value)}
                  disabled={loading}
                />
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Отмена
              </button>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Отправка...' : 'Отправить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}