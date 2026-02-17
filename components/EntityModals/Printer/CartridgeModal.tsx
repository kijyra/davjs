// components/Admin/modals/CartridgeModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';

interface CartridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any; // данные редактируемого картриджа или null для добавления
}

export default function CartridgeModal({ isOpen, onClose, onSuccess, initialData }: CartridgeModalProps) {
  const [formData, setFormData] = useState({ Model: '', Yield: '', ManufactorId: '' });
  const [manufacturers, setManufacturers] = useState<{ Id: number; Name: string }[]>([]);
  const [errors, setErrors] = useState<{ Model?: string; Yield?: string; ManufactorId?: string }>({});
  const [loading, setLoading] = useState(false);

  // Загрузка списка производителей при открытии
  useEffect(() => {
    if (isOpen) {
      apiFetch<{ Id: number; Name: string }[]>('/Printer/Manufactor')
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

  // Заполнение формы при редактировании
  useEffect(() => {
    if (initialData) {
      setFormData({
        Model: initialData.Model || '',
        Yield: initialData.Yield !== null && initialData.Yield !== undefined ? String(initialData.Yield) : '',
        ManufactorId: initialData.ManufactorId ? String(initialData.ManufactorId) : '',
      });
    } else {
      setFormData({ Model: '', Yield: '', ManufactorId: '' });
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
    formBody.append('Model', formData.Model);
    if (formData.Yield) {
      formBody.append('Yield', formData.Yield);
    }
    if (formData.ManufactorId) {
      formBody.append('ManufactorId', formData.ManufactorId);
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
              {/* Поле модели картриджа */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.Model ? 'is-invalid' : ''}`}
                  id="Model"
                  name="Model"
                  placeholder="Название картриджа"
                  value={formData.Model}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <label htmlFor="Model">Название картриджа</label>
                {errors.Model && <div className="invalid-feedback">{errors.Model}</div>}
              </div>

              {/* Поле ёмкости картриджа */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.Yield ? 'is-invalid' : ''}`}
                  id="Yield"
                  name="Yield"
                  placeholder="Ёмкость картриджа"
                  value={formData.Yield}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label htmlFor="Yield">Ёмкость картриджа</label>
                {errors.Yield && <div className="invalid-feedback">{errors.Yield}</div>}
              </div>

              {/* Выбор производителя */}
              <div className="form-floating">
                <select
                  className={`form-select ${errors.ManufactorId ? 'is-invalid' : ''}`}
                  id="ManufactorId"
                  name="ManufactorId"
                  value={formData.ManufactorId}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">-- Выберите производителя --</option>
                  {manufacturers.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <label htmlFor="ManufactorId">Выберите производителя</label>
                {errors.ManufactorId && <div className="invalid-feedback">{errors.ManufactorId}</div>}
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