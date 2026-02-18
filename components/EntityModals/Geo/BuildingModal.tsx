'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';

interface Location {
  id: number;
  name: string;
}

interface ApiResponse {
  success: boolean;
  errors?: string[];
}

export default function BuildingModal({ isOpen, onClose, onSuccess, initialData }: any) {
  const [formData, setFormData] = useState({ Name: '', LocationId: '' });
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      apiFetch<Location[]>('/Geo/Location')
        .then(setLocations)
        .catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        Name: initialData.Name || '',
        LocationId: initialData.LocationId ? String(initialData.LocationId) : '',
      });
    } else {
      setFormData({ Name: '', LocationId: '' });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = initialData ? '/Geo/BuildingEdit' : '/Geo/BuildingAdd';
    const body = new FormData();
    body.append('Name', formData.Name);
    if (formData.LocationId) body.append('LocationId', formData.LocationId);
    if (initialData) body.append('Id', String(initialData.Id));

    try {
      const res = await apiFetch<ApiResponse>(url, { method: 'POST', body });
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        alert('Ошибка: ' + (res.errors?.join(', ') || 'Неизвестная ошибка'));
      }
    } catch (error) {
      alert('Ошибка сохранения');
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
            <h5 className="modal-title">{initialData ? 'Редактировать' : 'Добавить'} здание</h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <label>Название</label>
              </div>
              <div className="form-floating">
                <select
                  className="form-select"
                  name="LocationId"
                  value={formData.LocationId}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">-- Не выбрана --</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
                <label>Локация</label>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Отмена</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}