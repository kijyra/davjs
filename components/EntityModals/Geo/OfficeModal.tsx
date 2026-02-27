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
  const [formData, setFormData] = useState({ name: '', floorId: '' });
  const [floors, setFloors] = useState<{ id: number; floorNum: string }[]>([]);
  const [errors, setErrors] = useState<{ name?: string; floorId?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      apiFetch<{ id: number; floorNum: string }[]>('/api/Geo/Floors')
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
        name: initialData.Name || '',
        floorId: initialData.FloorId ? String(initialData.FloorId) : '',
      });
    } else {
      setFormData({ name: '', floorId: '' });
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

    const url = initialData ? '/api/Geo/Office/Edit' : '/api/Geo/Office/Add';
    const formBody = new FormData();
    formBody.append('Name', formData.name);
    if (formData.floorId) {
      formBody.append('FloorId', formData.floorId);
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
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="Name"
                  name="Name"
                  placeholder="Название"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <label htmlFor="Name">Название</label>
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="input-group">
                <div className="form-floating flex-grow-1">
                  <select
                    className={`form-select ${errors.floorId ? 'is-invalid' : ''}`}
                    id="FloorId"
                    name="FloorId"
                    value={formData.floorId}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">-- Не выбран --</option>
                    {floors.map(f => (
                      <option key={f.id} value={f.id}>{f.floorNum}</option>
                    ))}
                  </select>
                  <label htmlFor="FloorId">Выберите этаж</label>
                  {errors.floorId && <div className="invalid-feedback">{errors.floorId}</div>}
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