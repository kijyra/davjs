'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';

interface PrinterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function PrinterModal({ isOpen, onClose, onSuccess, initialData }: PrinterModalProps) {
  const [formData, setFormData] = useState({
    printerName: '',
    printerModelId: '',
    iP: '',
    hostName: '',
    printCount: '',
    scanCount: '',
    lastFuserRepair: '',
    workplaceId: '',
  });
  const [models, setModels] = useState<{ id: number; name: string }[]>([]);
  const [workplaces, setWorkplaces] = useState<{ id: number; name: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        apiFetch<{ id: number; name: string }[]>('/api/Printer/PrinterModel'),
        apiFetch<{ id: number; name: string }[]>('/api/View/Workplace'),
      ])
        .then(([modelsData, workplacesData]) => {
          setModels(modelsData);
          setWorkplaces(workplacesData);
        })
        .catch(err => {
          console.error('Ошибка загрузки справочников:', err);
          alert('Не удалось загрузить списки моделей или рабочих мест');
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        printerName: initialData.PrinterName || '',
        printerModelId: initialData.PrinterModelId ? String(initialData.PrinterModelId) : '',
        iP: initialData.IP || '',
        hostName: initialData.HostName || '',
        printCount: initialData.PrintCount !== null && initialData.PrintCount !== undefined ? String(initialData.PrintCount) : '',
        scanCount: initialData.ScanCount !== null && initialData.ScanCount !== undefined ? String(initialData.ScanCount) : '',
        lastFuserRepair: initialData.LastFuserRepair || '',
        workplaceId: initialData.WorkplaceId ? String(initialData.WorkplaceId) : '',
      });
    } else {
      setFormData({
        printerName: '',
        printerModelId: '',
        iP: '',
        hostName: '',
        printCount: '',
        scanCount: '',
        lastFuserRepair: '',
        workplaceId: '',
      });
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const url = initialData ? '/api/Printer/PrinterEdit' : '/api/Printer/PrinterAdd';
    const formBody = new FormData();
    formBody.append('PrinterName', formData.printerName);
    if (formData.printerModelId) formBody.append('PrinterModelId', formData.printerModelId);
    formBody.append('IP', formData.iP);
    formBody.append('HostName', formData.hostName);
    if (formData.printCount) formBody.append('PrintCount', formData.printCount);
    if (formData.scanCount) formBody.append('ScanCount', formData.scanCount);
    formBody.append('LastFuserRepair', formData.lastFuserRepair);
    if (formData.workplaceId) formBody.append('WorkplaceId', formData.workplaceId);
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
      alert('Не удалось сохранить принтер');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ zIndex: 1080 }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{initialData ? 'Редактировать' : 'Добавить'} принтер</h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {errors.Summary && <div className="alert alert-danger">{errors.Summary}</div>}

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.PrinterName ? 'is-invalid' : ''}`}
                  id="PrinterName"
                  name="PrinterName"
                  placeholder="Название принтера"
                  value={formData.printerName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <label htmlFor="PrinterName">Название принтера</label>
                {errors.PrinterName && <div className="invalid-feedback">{errors.PrinterName}</div>}
              </div>

              <div className="form-floating mb-3">
                <select
                  className={`form-select ${errors.PrinterModelId ? 'is-invalid' : ''}`}
                  id="PrinterModelId"
                  name="PrinterModelId"
                  value={formData.printerModelId}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">-- Выберите модель принтера --</option>
                  {models.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <label htmlFor="PrinterModelId">Выберите модель принтера</label>
                {errors.PrinterModelId && <div className="invalid-feedback">{errors.PrinterModelId}</div>}
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.IP ? 'is-invalid' : ''}`}
                  id="IP"
                  name="IP"
                  placeholder="IP-адрес"
                  value={formData.iP}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <label htmlFor="IP">IP-адрес</label>
                {errors.IP && <div className="invalid-feedback">{errors.IP}</div>}
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.HostName ? 'is-invalid' : ''}`}
                  id="HostName"
                  name="HostName"
                  placeholder="Hostname"
                  value={formData.hostName}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label htmlFor="HostName">Hostname</label>
                {errors.HostName && <div className="invalid-feedback">{errors.HostName}</div>}
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className={`form-control ${errors.PrintCount ? 'is-invalid' : ''}`}
                      id="PrintCount"
                      name="PrintCount"
                      placeholder="Напечатано"
                      value={formData.printCount}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <label htmlFor="PrintCount">Напечатано</label>
                    {errors.PrintCount && <div className="invalid-feedback">{errors.PrintCount}</div>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className={`form-control ${errors.ScanCount ? 'is-invalid' : ''}`}
                      id="ScanCount"
                      name="ScanCount"
                      placeholder="Отсканировано"
                      value={formData.scanCount}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <label htmlFor="ScanCount">Отсканировано</label>
                    {errors.ScanCount && <div className="invalid-feedback">{errors.ScanCount}</div>}
                  </div>
                </div>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.LastFuserRepair ? 'is-invalid' : ''}`}
                  id="LastFuserRepair"
                  name="LastFuserRepair"
                  placeholder="Последний ремонт печи"
                  value={formData.lastFuserRepair}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label htmlFor="LastFuserRepair">Последний ремонт печи</label>
                {errors.LastFuserRepair && <div className="invalid-feedback">{errors.LastFuserRepair}</div>}
              </div>

              <div className="form-floating mb-3">
                <select
                  className={`form-select ${errors.WorkplaceId ? 'is-invalid' : ''}`}
                  id="WorkplaceId"
                  name="WorkplaceId"
                  value={formData.workplaceId}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">-- Не выбрано --</option>
                  {workplaces.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
                <label htmlFor="WorkplaceId">Выберите рабочее место</label>
                {errors.WorkplaceId && <div className="invalid-feedback">{errors.WorkplaceId}</div>}
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