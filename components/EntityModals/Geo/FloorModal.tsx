'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';

interface FloorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function FloorModal({ isOpen, onClose, onSuccess, initialData }: FloorModalProps) {
  const [formData, setFormData] = useState({ floorNum: '', buildingId: '' });
  const [buildings, setBuildings] = useState<{ id: number; name: string }[]>([]);
  const [errors, setErrors] = useState<{ FloorNum?: string; BuildingId?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      apiFetch<{ id: number; name: string }[]>('/api/Geo/Building')
        .then(data => {
          console.log('Здания загружены:', data);
          setBuildings(data);
        })
        .catch(err => {
          console.error('Ошибка загрузки зданий:', err);
          alert('Не удалось загрузить список зданий');
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        floorNum: initialData.FloorNum || '',
        buildingId: initialData.BuildingId ? String(initialData.BuildingId) : '',
      });
    } else {
      setFormData({ floorNum: '', buildingId: '' });
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

    const url = initialData ? '/api/Geo/Floor/Edit' : '/api/Geo/Floor/Add';
    const formBody = new FormData();
    formBody.append('FloorNum', formData.floorNum);
    if (formData.buildingId) {
      formBody.append('BuildingId', formData.buildingId);
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
      alert('Не удалось сохранить этаж');
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
            <h5 className="modal-title">{initialData ? 'Редактировать' : 'Добавить'} этаж</h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.FloorNum ? 'is-invalid' : ''}`}
                  id="FloorNum"
                  name="FloorNum"
                  placeholder="Название этажа"
                  value={formData.floorNum}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <label htmlFor="FloorNum">Название этажа</label>
                {errors.FloorNum && <div className="invalid-feedback">{errors.FloorNum}</div>}
              </div>

              <div className="input-group">
                <div className="form-floating flex-grow-1">
                  <select
                    className={`form-select ${errors.BuildingId ? 'is-invalid' : ''}`}
                    id="BuildingId"
                    name="BuildingId"
                    value={formData.buildingId}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">-- Не выбрано --</option>
                    {buildings.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                  <label htmlFor="BuildingId">Выберите здание</label>
                  {errors.BuildingId && <div className="invalid-feedback">{errors.BuildingId}</div>}
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