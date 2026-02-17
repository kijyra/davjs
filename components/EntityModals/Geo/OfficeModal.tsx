// components/Admin/modals/OfficeModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';

interface OfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function OfficeModal({ isOpen, onClose, onSuccess, initialData }: OfficeModalProps) {
  const [formData, setFormData] = useState({ Name: '', FloorId: '' });
  const [floors, setFloors] = useState<{ Id: number; FloorNum: string }[]>([]);
  const [errors, setErrors] = useState<{ Name?: string; FloorId?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      apiFetch<{ Id: number; FloorNum: string }[]>('/Geo/Floor')
        .then(data => {
          console.log('Этажи загружены:', data);
          setFloors(data);
        })
        .catch(err => {
          console.error('Ошибка загрузки этажей:', err);
          alert('Не удалось загрузить список этажей');
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        Name: initialData.Name || '',
        FloorId: initialData.FloorId ? String(initialData.FloorId) : '',
      });
    } else {
      setFormData({ Name: '', FloorId: '' });
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const url = initialData ? '/Geo/OfficeEdit' : '/Geo/OfficeAdd';
    const formBody = new FormData();
    formBody.append('Name', formData.Name);
    if (formData.FloorId) {
      formBody.append('FloorId', formData.FloorId);
    }
    if (initialData) {
      formBody.append('Id', String(initialData.Id));
    }

    try {
      const response = await apiFetch<{ success: boolean; errors?: Record<string, string[]> }>(url, {
        method: 'POST',
        body: formBody,
      });

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        if (response.errors) {
          const formattedErrors: any = {};
          Object.entries(response.errors).forEach(([key, messages]) => {
            formattedErrors[key] = messages.join(', ');
          });
          setErrors(formattedErrors);
        } else {
          alert('Ошибка при сохранении');
        }
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Не удалось сохранить кабинет');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ zIndex: 1080 }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{initialData ? 'Редактировать' : 'Добавить'} кабинет</h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.Name ? 'is-invalid' : ''}`}
                  id="Name"
                  name="Name"
                  placeholder="Название"
                  value={formData.Name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <label htmlFor="Name">Название</label>
                {errors.Name && <div className="invalid-feedback">{errors.Name}</div>}
              </div>

              <div className="input-group">
                <div className="form-floating flex-grow-1">
                  <select
                    className={`form-select ${errors.FloorId ? 'is-invalid' : ''}`}
                    id="FloorId"
                    name="FloorId"
                    value={formData.FloorId}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">-- Не выбран --</option>
                    {floors.map(f => (
                      <option key={f.id} value={f.id}>{f.floorNum}</option>
                    ))}
                  </select>
                  <label htmlFor="FloorId">Выберите этаж</label>
                  {errors.FloorId && <div className="invalid-feedback">{errors.FloorId}</div>}
                </div>

              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Отмена
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}