'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function PhoneModal({ isOpen, onClose, onSuccess, initialData }: PhoneModalProps) {
  const [formData, setFormData] = useState({
    Model: '',
    Number: '',
    Ip: '',
    Handset: false,
    NameInBase: '',
    Workplace: '',
  });
  const [workplaces, setWorkplaces] = useState<{ id: number; name: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      apiFetch<{ id: number; name: string }[]>('/api/View/Workplaces')
        .then(data => {
          setWorkplaces(data);
        })
        .catch(err => {
          console.error('Ошибка загрузки рабочих мест:', err);
          alert('Не удалось загрузить список рабочих мест');
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        Model: initialData.model || '',
        Number: initialData.number || '',
        Ip: initialData.ip || '',
        Handset: initialData.handset || false,
        NameInBase: initialData.nameInBase || '',
        Workplace: initialData.workplaceId ? String(initialData.workplaceId) : '',
      });
    } else {
      setFormData({
        Model: '',
        Number: '',
        Ip: '',
        Handset: false,
        NameInBase: '',
        Workplace: '',
      });
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const url = initialData ? '/api/PP/Phone/Edit' : '/api/PP/Phone/Add';
    const formBody = new FormData();
    formBody.append('Model', formData.Model);
    formBody.append('Number', formData.Number);
    formBody.append('Ip', formData.Ip);
    formBody.append('Handset', String(formData.Handset));
    formBody.append('NameInBase', formData.NameInBase);
    if (formData.Workplace) {
      formBody.append('WorkplaceId', formData.Workplace);
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
      alert('Не удалось сохранить телефон');
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
            <h5 className="modal-title">{initialData ? 'Редактировать' : 'Добавить'} телефон</h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Сводные ошибки */}
              {errors.Summary && <div className="alert alert-danger">{errors.Summary}</div>}

              {/* Модель телефона */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.Model ? 'is-invalid' : ''}`}
                  id="Model"
                  name="Model"
                  placeholder="Модель телефона"
                  value={formData.Model}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <label htmlFor="Model">Модель телефона</label>
                {errors.Model && <div className="invalid-feedback">{errors.Model}</div>}
              </div>

              {/* Номер телефона */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.Number ? 'is-invalid' : ''}`}
                  id="Number"
                  name="Number"
                  placeholder="Номер телефона"
                  value={formData.Number}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <label htmlFor="Number">Номер телефона</label>
                {errors.Number && <div className="invalid-feedback">{errors.Number}</div>}
              </div>

              {/* IP-адрес */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.Ip ? 'is-invalid' : ''}`}
                  id="Ip"
                  name="Ip"
                  placeholder="IP-адрес"
                  value={formData.Ip}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label htmlFor="Ip">IP-адрес</label>
                {errors.Ip && <div className="invalid-feedback">{errors.Ip}</div>}
              </div>

              {/* Чекбокс "Радиотелефон" */}
              <div className="input-group flex-nowrap mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="Handset"
                    name="Handset"
                    checked={formData.Handset}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <label className="form-check-label" htmlFor="Handset">Радиотелефон</label>
                </div>
              </div>

              {/* Поле "Название в базе" с иконкой */}
              <div className="input-group flex-nowrap mb-3">
                <span className="input-group-text" id="addon-wrapping">
                  <i className="bi bi-tag"></i>
                </span>
                <input
                  type="text"
                  className={`form-control ${errors.NameInBase ? 'is-invalid' : ''}`}
                  placeholder="Название в базе"
                  aria-label="Название в базе"
                  aria-describedby="addon-wrapping"
                  name="NameInBase"
                  value={formData.NameInBase}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.NameInBase && <div className="invalid-feedback">{errors.NameInBase}</div>}
              </div>

              {/* Выпадающий список рабочих мест */}
              <div className="form-floating mb-3">
                <select
                  className={`form-select ${errors.Workplace ? 'is-invalid' : ''}`}
                  id="Workplace"
                  name="Workplace"
                  value={formData.Workplace}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">-- Не выбрано --</option>
                  {workplaces.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
                <label htmlFor="Workplace">Выберите рабочее место</label>
                {errors.Workplace && <div className="invalid-feedback">{errors.Workplace}</div>}
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