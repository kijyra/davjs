'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';
import OfficeModal from './Geo/OfficeModal';
import UserModal from './User/UserModal';
import PCModal from './PP/PcModal';
import PhoneModal from './PP/PhoneModal';
import PrinterModal from './Printer/PrinterModal';

interface WorkplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function WorkplaceModal({ isOpen, onClose, onSuccess, initialData }: WorkplaceModalProps) {
  const [formData, setFormData] = useState({
    Name: '',
    Print: false,
    OfficeId: '',
    UserId: '',
    PCId: '',
    PhoneId: '',
    PrinterId: '',
  });

  const [offices, setOffices] = useState<{ id: number; fullTitle: string }[]>([]);
  const [users, setUsers] = useState<{ id: number; fullName: string }[]>([]);
  const [pcs, setPcs] = useState<{ id: number; fullName: string }[]>([]);
  const [phones, setPhones] = useState<{ id: number; number: string }[]>([]);
  const [printers, setPrinters] = useState<{ id: number; printerName: string }[]>([]);

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);

  const [isOfficeModalOpen, setIsOfficeModalOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState<any>(null);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [isPcModalOpen, setIsPcModalOpen] = useState(false);
  const [editingPc, setEditingPc] = useState<any>(null);

  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [editingPhone, setEditingPhone] = useState<any>(null);

  const [isPrinterModalOpen, setIsPrinterModalOpen] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        apiFetch<{ id: number; fullTitle: string }[]>('/api/Geo/Offices'),
        apiFetch<{ id: number; fullName: string }[]>('/api/User/Users'),
        apiFetch<{ id: number; fullName: string }[]>('/api/PP/PCs'),
        apiFetch<{ id: number; number: string }[]>('/api/PP/Phones'),
        apiFetch<{ id: number; printerName: string }[]>('/api/Printer/Printers'),
      ])
        .then(([officesData, usersData, pcsData, phonesData, printersData]) => {
          setOffices(officesData);
          setUsers(usersData);
          setPcs(pcsData);
          setPhones(phonesData);
          setPrinters(printersData);
        })
        .catch(err => {
          console.error('Ошибка загрузки справочников:', err);
          alert('Не удалось загрузить списки');
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        Name: initialData.name || '',
        Print: initialData.print || false,
        OfficeId: initialData.officeId ? String(initialData.officeId) : '',
        UserId: initialData.userId ? String(initialData.userId) : '',
        PCId: initialData.pCId ? String(initialData.pCId) : '',
        PhoneId: initialData.phoneId ? String(initialData.phoneId) : '',
        PrinterId: initialData.printerId ? String(initialData.printerId) : '',
      });
    } else {
      setFormData({
        Name: '',
        Print: false,
        OfficeId: '',
        UserId: '',
        PCId: '',
        PhoneId: '',
        PrinterId: '',
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

    const url = initialData ? '/api/View/Workplace/Edit' : '/api/View/Workplace/Add';
    const formBody = new FormData();
    formBody.append('Name', formData.Name);
    formBody.append('Print', String(formData.Print));
    if (formData.OfficeId) formBody.append('OfficeId', formData.OfficeId);
    if (formData.UserId) formBody.append('UserId', formData.UserId);
    if (formData.PCId) formBody.append('PCId', formData.PCId);
    if (formData.PhoneId) formBody.append('PhoneId', formData.PhoneId);
    if (formData.PrinterId) formBody.append('PrinterId', formData.PrinterId);
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
      alert('Не удалось сохранить рабочее место');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOffice = () => {
    setEditingOffice(null);
    setIsOfficeModalOpen(true);
  };
  const handleEditOffice = () => {
    if (!formData.OfficeId) return;
    const office = offices.find(o => o.id === Number(formData.OfficeId));
    setEditingOffice(office);
    setIsOfficeModalOpen(true);
  };
  const handleDeleteOffice = async () => {
    if (!formData.OfficeId) return;
    if (!confirm('Вы уверены, что хотите удалить этот офис?')) return;
    try {
      await apiFetch(`/api/Geo/Office/Delete/${formData.OfficeId}`, { method: 'POST' });
      const updated = await apiFetch<{ id: number; fullTitle: string }[]>('/api/Geo/Offices');
      setOffices(updated);
      setFormData(prev => ({ ...prev, OfficeId: '' }));
    } catch (error) {
      alert('Ошибка удаления офиса');
    }
  };

  const handleAddUser = () => { setEditingUser(null); setIsUserModalOpen(true); };
  const handleEditUser = () => { if (!formData.UserId) return; const user = users.find(u => u.id === Number(formData.UserId)); setEditingUser(user); setIsUserModalOpen(true); };
  const handleDeleteUser = async () => { 
        if (!formData.OfficeId) return;
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
    try {
      await apiFetch(`/api/User/User/Delete/${formData.UserId}`, { method: 'POST' });
      const updated = await apiFetch<{ id: number; fullName: string }[]>('/api/User/Users');
      setUsers(updated);
      setFormData(prev => ({ ...prev, UserId: '' }));
    } catch (error) {
      alert('Ошибка удаления пользователя');
    }
   };

  const handleAddPC = () => { setEditingPc(null); setIsPcModalOpen(true); };
  const handleEditPC = () => { if (!formData.PCId) return; const pc = pcs.find(p => p.id === Number(formData.PCId)); setEditingPc(pc); setIsPcModalOpen(true); };
  const handleDeletePC = async () => { 
        if (!formData.OfficeId) return;
    if (!confirm('Вы уверены, что хотите удалить этот ПК?')) return;
    try {
      await apiFetch(`/api/PP/PC/Delete/${formData.PCId}`, { method: 'POST' });
      const updated = await apiFetch<{ id: number; fullName: string }[]>('/api/PP/PCs');
      setPcs(updated);
      setFormData(prev => ({ ...prev, PCId: '' }));
    } catch (error) {
      alert('Ошибка удаления ПК');
    }
   };

  const handleAddPhone = () => { setEditingPhone(null); setIsPhoneModalOpen(true); };
  const handleEditPhone = () => { if (!formData.PhoneId) return; const phone = phones.find(p => p.id === Number(formData.PhoneId)); setEditingPhone(phone); setIsPhoneModalOpen(true); };
  const handleDeletePhone = async () => { 
    if (!formData.OfficeId) return;
    if (!confirm('Вы уверены, что хотите удалить этот телефон?')) return;
    try {
      await apiFetch(`/api/PP/Phone/Delete/${formData.PhoneId}`, { method: 'POST' });
      const updated = await apiFetch<{ id: number; number: string }[]>('/api/PP/Phones');
      setPhones(updated);
      setFormData(prev => ({ ...prev, PhoneId: '' }));
    } catch (error) {
      alert('Ошибка удаления телефона');
    }
   };

  const handleAddPrinter = () => { setEditingPrinter(null); setIsPrinterModalOpen(true); };
  const handleEditPrinter = () => { if (!formData.PrinterId) return; const printer = printers.find(p => p.id === Number(formData.PrinterId)); setEditingPrinter(printer); setIsPrinterModalOpen(true); };
  const handleDeletePrinter = async () => { 
            if (!formData.OfficeId) return;
    if (!confirm('Вы уверены, что хотите удалить этот принтер?')) return;
    try {
      await apiFetch(`/api/printer/printer/Delete/${formData.PrinterId}`, { method: 'POST' });
      const updated = await apiFetch<{ id: number; printerName: string }[]>('/api/printer/printers');
      setPrinters(updated);
      setFormData(prev => ({ ...prev, PrinterId: '' }));
    } catch (error) {
      alert('Ошибка удаления принтера');
    }
   };

  const handleOfficeModalSuccess = () => {
    apiFetch<{ id: number; fullTitle: string }[]>('/api/Geo/Offices').then(setOffices).catch(console.error);
    setIsOfficeModalOpen(false);
    setEditingOffice(null);
  };
  const handleUserModalSuccess = () => {
    apiFetch<{ id: number; fullName: string }[]>('/User/Users').then(setUsers).catch(console.error);
    setIsUserModalOpen(false);
    setEditingUser(null);
  };
  const handlePCModalSuccess = () => {
    apiFetch<{ id: number; fullName: string }[]>('/api/PP/PCs').then(setPcs).catch(console.error);
    setIsPcModalOpen(false);
    setEditingPc(null);
  };
  const handlePhoneModalSuccess = () => {
    apiFetch<{ id: number; number: string }[]>('/api/PP/Phones').then(setPhones).catch(console.error);
    setIsPhoneModalOpen(false);
    setEditingPhone(null);
  };
  const handlePrinterModalSuccess = () => {
    apiFetch<{ id: number; printerName: string }[]>('/api/Printer/Printers').then(setPrinters).catch(console.error);
    setIsPrinterModalOpen(false);
    setEditingPrinter(null);
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ zIndex: 1080 }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{initialData ? 'Редактировать' : 'Добавить'} рабочее место</h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {errors.Summary && <div className="alert alert-danger">{errors.Summary}</div>}

              {/* Поле Название */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.Name ? 'is-invalid' : ''}`}
                  id="Name"
                  name="Name"
                  placeholder="Название"
                  value={formData.Name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <label htmlFor="Name">Название</label>
                {errors.Name && <div className="invalid-feedback">{errors.Name}</div>}
              </div>

              {/* Чекбокс "Рабочее место - принтер?" */}
              <div className="input-group mb-3">
                <div className="input-group-text">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="Print"
                    name="Print"
                    checked={formData.Print}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <label className="input-group-text" htmlFor="Print">Рабочее место - принтер?</label>
              </div>

              {/* Офис */}
              <div className="input-group mb-3">
                <div className="form-floating flex-grow-1">
                  <select
                    className={`form-select ${errors.OfficeId ? 'is-invalid' : ''}`}
                    id="OfficeId"
                    name="OfficeId"
                    value={formData.OfficeId}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">-- Не выбрано --</option>
                    {offices.map(o => (
                      <option key={o.id} value={o.id}>{o.fullTitle}</option>
                    ))}
                  </select>
                  <label htmlFor="OfficeId">Выберите кабинет</label>
                  {errors.OfficeId && <div className="invalid-feedback">{errors.OfficeId}</div>}
                </div>
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-outline-info"
                    onClick={handleAddOffice}
                    disabled={loading}
                    title="Добавить"
                  >
                    <i className="bi bi-plus-lg"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    onClick={handleEditOffice}
                    disabled={loading || !formData.OfficeId}
                    title="Редактировать"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={handleDeleteOffice}
                    disabled={loading || !formData.OfficeId}
                    title="Удалить"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>

              {/* Пользователь */}
              <div className="input-group mb-3">
                <div className="form-floating flex-grow-1">
                  <select
                    className={`form-select ${errors.UserId ? 'is-invalid' : ''}`}
                    id="UserId"
                    name="UserId"
                    value={formData.UserId}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">-- Не выбран --</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.fullName}</option>
                    ))}
                  </select>
                  <label htmlFor="UserId">Выберите пользователя</label>
                  {errors.UserId && <div className="invalid-feedback">{errors.UserId}</div>}
                </div>
                <div className="btn-group">
                  <button type="button" className="btn btn-outline-info" onClick={handleAddUser} disabled={loading}><i className="bi bi-plus-lg"></i></button>
                  <button type="button" className="btn btn-outline-warning" onClick={handleEditUser} disabled={loading || !formData.UserId}><i className="bi bi-pencil"></i></button>
                  <button type="button" className="btn btn-outline-danger" onClick={handleDeleteUser} disabled={loading || !formData.UserId}><i className="bi bi-trash"></i></button>
                </div>
              </div>

              {/* Компьютер */}
              <div className="input-group mb-3">
                <div className="form-floating flex-grow-1">
                  <select
                    className={`form-select ${errors.PCId ? 'is-invalid' : ''}`}
                    id="PCId"
                    name="PCId"
                    value={formData.PCId}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">-- Не выбран --</option>
                    {pcs.map(p => (
                      <option key={p.id} value={p.id}>{p.fullName}</option>
                    ))}
                  </select>
                  <label htmlFor="PCId">Выберите компьютер</label>
                  {errors.PCId && <div className="invalid-feedback">{errors.PCId}</div>}
                </div>
                <div className="btn-group">
                  <button type="button" className="btn btn-outline-info" onClick={handleAddPC} disabled={loading}><i className="bi bi-plus-lg"></i></button>
                  <button type="button" className="btn btn-outline-warning" onClick={handleEditPC} disabled={loading || !formData.PCId}><i className="bi bi-pencil"></i></button>
                  <button type="button" className="btn btn-outline-danger" onClick={handleDeletePC} disabled={loading || !formData.PCId}><i className="bi bi-trash"></i></button>
                </div>
              </div>

              {/* Телефон */}
              <div className="input-group mb-3">
                <div className="form-floating flex-grow-1">
                  <select
                    className={`form-select ${errors.PhoneId ? 'is-invalid' : ''}`}
                    id="PhoneId"
                    name="PhoneId"
                    value={formData.PhoneId}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">-- Не выбран --</option>
                    {phones.map(p => (
                      <option key={p.id} value={p.id}>{p.number}</option>
                    ))}
                  </select>
                  <label htmlFor="PhoneId">Выберите телефон</label>
                  {errors.PhoneId && <div className="invalid-feedback">{errors.PhoneId}</div>}
                </div>
                <div className="btn-group">
                  <button type="button" className="btn btn-outline-info" onClick={handleAddPhone} disabled={loading}><i className="bi bi-plus-lg"></i></button>
                  <button type="button" className="btn btn-outline-warning" onClick={handleEditPhone} disabled={loading || !formData.PhoneId}><i className="bi bi-pencil"></i></button>
                  <button type="button" className="btn btn-outline-danger" onClick={handleDeletePhone} disabled={loading || !formData.PhoneId}><i className="bi bi-trash"></i></button>
                </div>
              </div>

              {/* Принтер */}
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
                <div className="btn-group">
                  <button type="button" className="btn btn-outline-info" onClick={handleAddPrinter} disabled={loading}><i className="bi bi-plus-lg"></i></button>
                  <button type="button" className="btn btn-outline-warning" onClick={handleEditPrinter} disabled={loading || !formData.PrinterId}><i className="bi bi-pencil"></i></button>
                  <button type="button" className="btn btn-outline-danger" onClick={handleDeletePrinter} disabled={loading || !formData.PrinterId}><i className="bi bi-trash"></i></button>
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

      {/* Дочерние модальные окна */}
      <OfficeModal
        isOpen={isOfficeModalOpen}
        onClose={() => { setIsOfficeModalOpen(false); setEditingOffice(null); }}
        onSuccess={handleOfficeModalSuccess}
        initialData={editingOffice}
      />
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => { setIsUserModalOpen(false); setEditingUser(null); }}
        onSuccess={handleUserModalSuccess}
        initialData={editingUser}
      />

      <PCModal
        isOpen={isPcModalOpen}
        onClose={() => { setIsPcModalOpen(false); setEditingPc(null); }}
        onSuccess={handlePCModalSuccess}
        initialData={editingPc}
      />
      <PhoneModal
        isOpen={isPhoneModalOpen}
        onClose={() => { setIsPhoneModalOpen(false); setEditingPhone(null); }}
        onSuccess={handlePhoneModalSuccess}
        initialData={editingPhone}
      />
      <PrinterModal
        isOpen={isPrinterModalOpen}
        onClose={() => { setIsPrinterModalOpen(false); setEditingPrinter(null); }}
        onSuccess={handlePrinterModalSuccess}
        initialData={editingPrinter}
      />
    </div>
  );
}