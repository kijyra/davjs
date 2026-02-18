'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';

interface CartridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function CartridgeModal({ isOpen, onClose, onSuccess, initialData }: CartridgeModalProps) {
  const [formData, setFormData] = useState({ model: '', yield: '', manufactorId: '' });
  const [manufacturers, setManufacturers] = useState<{ id: number; name: string }[]>([]);
  const [errors, setErrors] = useState<{ model?: string; yield?: string; manufactorId?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      apiFetch<{ id: number; name: string }[]>('/Printer/Manufactor')
        .then(data => {
          console.log('Производители загружены:', data);
          setManufacturers(data);
        })
        .catch(err => {
          console.error('Ошибка загрузки производителей:', err);
          alert('Не удалось загрузить список производителей');
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        model: initialData.Model || '',
        yield: initialData.Yield !== null && initialData.Yield !== undefined ? String(initialData.Yield) : '',
        manufactorId: initialData.ManufactorId ? String(initialData.ManufactorId) : '',
      });
    } else {
      setFormData({ model: '', yield: '', manufactorId: '' });
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

    const url = initialData ? '/Printer/CartridgeEdit' : '/Printer/CartridgeAdd';
    const formBody = new FormData();
    formBody.append('Model', formData.model);
    if (formData.yield) {
      formBody.append('Yield', formData.yield);
    }
    if (formData.manufactorId) {
      formBody.append('ManufactorId', formData.manufactorId);
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
      alert('Не удалось сохранить картридж');
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
            <h5 className="modal-title">{initialData ? 'Редактировать' : 'Добавить'} картридж</h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.model ? 'is-invalid' : ''}`}
                  id="Model"
                  name="Model"
                  placeholder="Название картриджа"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <label htmlFor="Model">Название картриджа</label>
                {errors.model && <div className="invalid-feedback">{errors.model}</div>}
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.yield ? 'is-invalid' : ''}`}
                  id="Yield"
                  name="Yield"
                  placeholder="Ёмкость картриджа"
                  value={formData.yield}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label htmlFor="Yield">Ёмкость картриджа</label>
                {errors.yield && <div className="invalid-feedback">{errors.yield}</div>}
              </div>

              <div className="form-floating">
                <select
                  className={`form-select ${errors.manufactorId ? 'is-invalid' : ''}`}
                  id="ManufactorId"
                  name="ManufactorId"
                  value={formData.manufactorId}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">-- Выберите производителя --</option>
                  {manufacturers.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <label htmlFor="ManufactorId">Выберите производителя</label>
                {errors.manufactorId && <div className="invalid-feedback">{errors.manufactorId}</div>}
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