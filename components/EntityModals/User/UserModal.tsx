'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';
import ADUserModal from './ADUserModal';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function UserModal({ isOpen, onClose, onSuccess, initialData }: UserModalProps) {
  const [formData, setFormData] = useState({
    Name: '',
    SurName: '',
    Position: '',
    Bitrix: '',
    ADUserId: '',
    PrinterId: '',
    WorkplaceId: '',
  });
  const [adUsers, setAdUsers] = useState<{ id: number; cn: string }[]>([]);
  const [workplaces, setWorkplaces] = useState<{ id: number; name: string }[]>([]);
  const [printers, setPrinters] = useState<{ id: number; printerName: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);
  const [isADUserModalOpen, setIsADUserModalOpen] = useState(false);
  const [editingADUser, setEditingADUser] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        apiFetch<{ id: number; cn: string }[]>('/api/User/ADUsers'),
        apiFetch<{ id: number; name: string }[]>('/api/View/Workplaces'),
        apiFetch<{ id: number; printerName: string }[]>('/api/Printer/Printers'),
      ])
        .then(([adUsersData, workplacesData, printersData]) => {
          setAdUsers(adUsersData);
          setWorkplaces(workplacesData);
          setPrinters(printersData);
        })
        .catch(err => {
          console.error('Ошибка загрузки справочников:', err);
          alert('Не удалось загрузить списки AD-пользователей, рабочих мест или принтеров');
        });
    }
  }, [isOpen]);

  useEffect(() => {
    console.log('🚀 User: ', initialData);
    if (initialData) {
      setFormData({
        Name: initialData.name || '',
        SurName: initialData.surName || '',
        Position: initialData.position || '',
        Bitrix: initialData.bitrix != null ? String(initialData.bitrix) : '',
        ADUserId: initialData.adUserId ? String(initialData.adUserId) : '',
        PrinterId: initialData.printerId ? String(initialData.printerId) : '',
        WorkplaceId: initialData.workplaceId ? String(initialData.workplaceId) : '',
      });
    } else {
      setFormData({
        Name: '',
        SurName: '',
        Position: '',
        Bitrix: '',
        ADUserId: '',
        PrinterId: '',
        WorkplaceId: '',
      });
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

    const url = initialData ? '/User/User/Edit' : '/User/User/Add';
    const formBody = new FormData();
    formBody.append('Name', formData.Name);
    formBody.append('SurName', formData.SurName);
    formBody.append('Position', formData.Position);
    if (formData.Bitrix) formBody.append('Bitrix', formData.Bitrix);
    if (formData.ADUserId) formBody.append('ADUserId', formData.ADUserId);
    if (formData.PrinterId) formBody.append('PrinterId', formData.PrinterId);
    if (formData.WorkplaceId) formBody.append('WorkplaceId', formData.WorkplaceId);
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
      alert('Не удалось сохранить пользователя');
    } finally {
      setLoading(false);
    }
  };

    const handleAddADUser = () => {
    setEditingADUser(null);
    setIsADUserModalOpen(true);
  };

  const handleADUserModalClose = () => {
    setIsADUserModalOpen(false);
    setEditingADUser(null);
  };

  const handleADUserModalSuccess = (newUser?: any) => {
    apiFetch<{ id: number; cn: string }[]>('/User/ADUser')
      .then(data => {
        setAdUsers(data);
        if (newUser?.Id) {
          setFormData(prev => ({ ...prev, ADUserId: String(newUser.Id) }));
        }
      })
      .catch(err => console.error('Ошибка обновления списка AD-пользователей:', err));
    handleADUserModalClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ zIndex: 1080 }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{initialData ? 'Редактировать' : 'Добавить'} пользователя</h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {errors.Summary && <div className="alert alert-danger">{errors.Summary}</div>}

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.Name ? 'is-invalid' : ''}`}
                  id="Name"
                  name="Name"
                  placeholder="Имя"
                  value={formData.Name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <label htmlFor="Name">Имя</label>
                {errors.Name && <div className="invalid-feedback">{errors.Name}</div>}
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.SurName ? 'is-invalid' : ''}`}
                  id="SurName"
                  name="SurName"
                  placeholder="Фамилия"
                  value={formData.SurName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <label htmlFor="SurName">Фамилия</label>
                {errors.SurName && <div className="invalid-feedback">{errors.SurName}</div>}
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.Position ? 'is-invalid' : ''}`}
                  id="Position"
                  name="Position"
                  placeholder="Должность"
                  value={formData.Position}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label htmlFor="Position">Должность</label>
                {errors.Position && <div className="invalid-feedback">{errors.Position}</div>}
              </div>

              <div className="form-floating mb-3">
                <input
                  type="number"
                  className={`form-control ${errors.Bitrix ? 'is-invalid' : ''}`}
                  id="Bitrix"
                  name="Bitrix"
                  placeholder="Битрикс"
                  value={formData.Bitrix}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label htmlFor="Bitrix">Битрикс</label>
                {errors.Bitrix && <div className="invalid-feedback">{errors.Bitrix}</div>}
              </div>

              <div className="input-group mb-3">
                <div className="form-floating flex-grow-1">
                  <select
                    className={`form-select ${errors.ADUserId ? 'is-invalid' : ''}`}
                    id="ADUserId"
                    name="ADUserId"
                    value={formData.ADUserId}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">-- Не выбран --</option>
                    {adUsers.map(u => (
                      <option key={u.id} value={u.id}>{u.cn}</option>
                    ))}
                  </select>
                  <label htmlFor="ADUserId">Выберите пользователя в AD</label>
                  {errors.ADUserId && <div className="invalid-feedback">{errors.ADUserId}</div>}
                </div>
                <button
                  type="button"
                  className="btn btn-outline-info d-flex align-items-center"
                  title="Добавить AD-пользователя"
                  onClick={handleAddADUser}
                  disabled={loading}
                >
                  <i className="bi bi-plus-lg"></i>
                </button>
              </div>

              <div className="form-floating mb-3">
                <select
                  className={`form-select ${errors.WorkplaceId ? 'is-invalid' : ''}`}
                  id="WorkplaceId"
                  name="WorkplaceId"
                  value={formData.WorkplaceId}
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

              <div className="input-group mb-3">
                <div className="form-floating flex-grow-1">
                  <select
                    className={`form-select ${errors.PrinterId ? 'is-invalid' : ''}`}
                    id="PrinterId"
                    name="PrinterId"
                    value={formData.PrinterId}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">-- Не выбран --</option>
                    {printers.map(p => (
                      <option key={p.id} value={p.id}>{p.printerName}</option>
                    ))}
                  </select>
                  <label htmlFor="PrinterId">Выберите принтер</label>
                  {errors.PrinterId && <div className="invalid-feedback">{errors.PrinterId}</div>}
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
      <ADUserModal
        isOpen={isADUserModalOpen}
        onClose={handleADUserModalClose}
        onSuccess={handleADUserModalSuccess}
        defaultIdentity={typeof editingADUser === 'string' ? editingADUser : "dallari\\"}
      />
    </div>
  );
}