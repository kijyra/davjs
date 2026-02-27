'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';

interface PCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function PCModal({ isOpen, onClose, onSuccess, initialData }: PCModalProps) {
  const [formData, setFormData] = useState({
    Hostname: '',
    IP: '',
    Anydesk: '',
    Domain: false,
    Think: false,
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
        Hostname: initialData.hostname || '',
        IP: initialData.ip || '',
        Anydesk: initialData.anydesk || '',
        Domain: initialData.domain || false,
        Think: initialData.think || false,
        Workplace: initialData.workplaceId ? String(initialData.workplaceId) : '',
      });
    } else {
      setFormData({
        Hostname: '',
        IP: '',
        Anydesk: '',
        Domain: false,
        Think: false,
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

    const url = initialData ? '/api/PP/PC/Edit' : '/api/PP/PC/Add';
    const formBody = new FormData();
    formBody.append('Hostname', formData.Hostname);
    formBody.append('IP', formData.IP);
    formBody.append('Anydesk', formData.Anydesk);
    formBody.append('Domain', String(formData.Domain));
    formBody.append('Think', String(formData.Think));
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
      alert('Не удалось сохранить компьютер');
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
            <h5 className="modal-title">{initialData ? 'Редактировать' : 'Добавить'} компьютер</h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {errors.Summary && <div className="alert alert-danger">{errors.Summary}</div>}

              {/* Поле Hostname */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.Hostname ? 'is-invalid' : ''}`}
                  id="Hostname"
                  name="Hostname"
                  placeholder="Имя компьютера"
                  value={formData.Hostname}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <label htmlFor="Hostname">Имя компьютера</label>
                {errors.Hostname && <div className="invalid-feedback">{errors.Hostname}</div>}
              </div>

              {/* Поле IP */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.IP ? 'is-invalid' : ''}`}
                  id="IP"
                  name="IP"
                  placeholder="IP-адрес"
                  value={formData.IP}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label htmlFor="IP">IP-адрес</label>
                {errors.IP && <div className="invalid-feedback">{errors.IP}</div>}
              </div>

              {/* Поле Anydesk */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.Anydesk ? 'is-invalid' : ''}`}
                  id="Anydesk"
                  name="Anydesk"
                  placeholder="Anydesk ID"
                  value={formData.Anydesk}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label htmlFor="Anydesk">Anydesk ID</label>
                {errors.Anydesk && <div className="invalid-feedback">{errors.Anydesk}</div>}
              </div>

              {/* Чекбокс Domain */}
              <div className="input-group flex-nowrap mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="Domain"
                    name="Domain"
                    checked={formData.Domain}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <label className="form-check-label" htmlFor="Domain">В домене</label>
                </div>
              </div>

              {/* Чекбокс Think (тонкий клиент) */}
              <div className="input-group flex-nowrap mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="Think"
                    name="Think"
                    checked={formData.Think}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <label className="form-check-label" htmlFor="Think">Тонкий клиент</label>
                </div>
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