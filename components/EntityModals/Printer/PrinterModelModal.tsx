'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';

interface PrinterModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function PrinterModelModal({ isOpen, onClose, onSuccess, initialData }: PrinterModelModalProps) {
  const [formData, setFormData] = useState({ Name: '', MFP: false, CartridgeId: '' });
  const [cartridges, setCartridges] = useState<{ id: number; model: string }[]>([]);
  const [errors, setErrors] = useState<{ Name?: string; CartridgeId?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      apiFetch<any[]>('/api/Printer/Cartridge')
        .then(data => {
          const mappedData = data.map(cartridge => ({
            id: cartridge.id,
            model: cartridge.model
          }));
          console.log('Картриджи загружены:', mappedData);
          setCartridges(mappedData);
        })
        .catch(err => {
          console.error('Ошибка загрузки картриджей:', err);
          alert('Не удалось загрузить список картриджей');
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        Name: initialData.Name || '',
        MFP: initialData.MFP || false,
        CartridgeId: initialData.CartridgeId ? String(initialData.CartridgeId) : '',
      });
    } else {
      setFormData({ Name: '', MFP: false, CartridgeId: '' });
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const url = initialData ? '/api/Printer/PrinterModelEdit' : '/api/Printer/PrinterModelAdd';
    const formBody = new FormData();
    formBody.append('Name', formData.Name);
    formBody.append('MFP', String(formData.MFP));
    if (formData.CartridgeId) {
      formBody.append('CartridgeId', formData.CartridgeId);
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
      alert('Не удалось сохранить модель принтера');
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
            <h5 className="modal-title">{initialData ? 'Редактировать' : 'Добавить'} модель принтера</h5>
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
                  placeholder="Наименование модели"
                  value={formData.Name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <label htmlFor="Name">Наименование модели</label>
                {errors.Name && <div className="invalid-feedback">{errors.Name}</div>}
              </div>

              <div className="input-group flex-nowrap mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="MFP"
                    name="MFP"
                    checked={formData.MFP}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <label className="form-check-label" htmlFor="MFP">
                    МФУ
                  </label>
                </div>
              </div>

              <div className="form-floating">
                <select
                  className={`form-select ${errors.CartridgeId ? 'is-invalid' : ''}`}
                  id="CartridgeId"
                  name="CartridgeId"
                  value={formData.CartridgeId}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">-- Выберите картридж --</option>
                  {cartridges.map(c => (
                    <option key={c.id} value={c.id}>{c.model}</option>
                  ))}
                </select>
                <label htmlFor="CartridgeId">Выберите картридж</label>
                {errors.CartridgeId && <div className="invalid-feedback">{errors.CartridgeId}</div>}
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