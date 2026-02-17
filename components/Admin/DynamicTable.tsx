'use client'

import { Trash2, Edit, Plus, Search, SortAsc, SortDesc } from 'lucide-react'
import { useState, useMemo } from 'react';

import { 
  deletePhone, 
  deletePC, 
  deleteBuilding, 
  deleteLocation, 
  deleteOffice, 
  deleteFloor,
  deleteManufactor,
  deleteCartridge,
  deletePrinterModel,
  deletePrinter,
  deleteUser,
  deleteADUser,
} from '@/services/delete';

import LocationModal from '../EntityModals/Geo/LocationModal';
import BuildingModal from '../EntityModals/Geo/BuildingModal';
import FloorModal from '../EntityModals/Geo/FloorModal';
import OfficeModal from '../EntityModals/Geo/OfficeModal';
import ManufactorModal from '../EntityModals/Printer/ManufactorModal';
import CartridgeModal from '../EntityModals/Printer/CartridgeModal';
import PrinterModelModal from '../EntityModals/Printer/PrinterModelModal';
import PrinterModal from '../EntityModals/Printer/PrinterModelModal';
import UserModal from '../EntityModals/User/UserModal';
import ADUserUpdateModal from '../EntityModals/User/ADUserModal';
 
const deleteApiMap: Record<string, (id: number) => Promise<any>> = {
  Locations: deleteLocation,
  Buildings: deleteBuilding,
  Floors: deleteFloor,
  Offices: deleteOffice,
  Manufactors: deleteManufactor,
  Cartridges: deleteCartridge,
  PrinterModels: deletePrinterModel,
  Printers: deletePrinter,
  Users: deleteUser,
  ADUsers: deleteADUser,
};

const modalComponents: Record<string, React.ComponentType<any>> = {
  Locations: LocationModal,
  Buildings: BuildingModal,
  Floors: FloorModal,
  Offices: OfficeModal,
  Manufactors: ManufactorModal,
  Cartridges: CartridgeModal,
  PrinterModels: PrinterModelModal,
  Printers: PrinterModal,
  Users: UserModal,
  ADUsers: ADUserUpdateModal
};

interface SortConfig {
  key: string | null;
  direction: 'ascending' | 'descending';
}

export default function DynamicTable({ tableName, data, onRefresh }: any) {
  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить запись?')) return;

    const deleteFn = deleteApiMap[tableName];
    if (!deleteFn) {
      alert(`Удаление для таблицы ${tableName} не реализовано`);
      return;
    }

    try {
      await deleteFn(id);
      onRefresh(); // обновить таблицу после удаления
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Не удалось удалить запись');
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null); // null = режим добавления

  const handleAdd = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleModalSuccess = () => {
    onRefresh(); // обновить данные после добавления/редактирования
    handleModalClose();
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'ascending' });

  if (!data || data.length === 0) return <div className="p-5 text-center text-muted">Нет данных в таблице {tableName}</div>

  const columns = Object.keys(data[0])

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return data.filter((row: any) =>
      columns.some(col =>
        String(row[col]).toLowerCase().includes(lowerCaseSearch)
      )
    );
  }, [data, searchTerm, columns]);

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (String(a[sortConfig.key!]) < String(b[sortConfig.key!])) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (String(a[sortConfig.key!]) > String(b[sortConfig.key!])) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  if (sortedData.length === 0 && searchTerm) {
      return <div className="p-5 text-center text-muted">Ничего не найдено по запросу "{searchTerm}"</div>;
  }
  
  return (
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="card-title">{tableName}</h2>
        <button
          onClick={handleAdd}
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <Plus size={18} /> Добавить
        </button>
      </div>

      <div className="mb-3 position-relative">
        <input
          type="text"
          placeholder={`Поиск в ${tableName}...`}
          className="form-control ps-5" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="position-absolute start-3 top-50 translate-middle-y text-muted" size={18} />
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover caption-top">
          <thead className="table-light">
            <tr>
              {columns.map(col => (
                <th scope="col" key={col} className="cursor-pointer" onClick={() => requestSort(col)}>
                  <div className="d-flex align-items-center gap-1">
                    {col}
                    {sortConfig.key === col && (
                      sortConfig.direction === 'ascending' ? <SortAsc size={14} /> : <SortDesc size={14} />
                    )}
                  </div>
                </th>
              ))}
              <th scope="col" className="text-end">Действия</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row: any, i: number) => (
              <tr key={i}>
                {columns.map(col => (
                  <td key={col}>
                    {String(row[col])}
                  </td>
                ))}
                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      onClick={() => handleEdit(row)}
                      className="btn btn-sm btn-outline-info border-0 p-1"
                    >
                      <Edit size={16} />
                    </button>
                   <button
                    onClick={() => handleDelete(row.Id)}
                    className="btn btn-sm btn-outline-danger border-0 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(() => {
          const ModalComponent = modalComponents[tableName];
          return ModalComponent ? (
            <ModalComponent
              isOpen={isModalOpen}
              onClose={handleModalClose}
              onSuccess={handleModalSuccess}
              initialData={editingRecord}
            />
          ) : null;
        })()}
      </div>
    </div>
  )
}
