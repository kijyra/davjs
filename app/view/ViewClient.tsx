'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import WorkplaceDetails from '@/components/View/WorkplaceDetails';
import { useState } from 'react';
import HardwareInfoModal from '@/components/View/HardwareInfoModal';
import WorkplaceModal from '@/components/EntityModals/WorkplaceModal';
import OfficeModal from '@/components/EntityModals/Geo/OfficeModal';
import { apiFetch } from '@/services/api';

interface ViewClientProps {
  buildings: { id: number; name: string }[];
  selectedBuilding: any;
  selectedFloor: any;
}
interface ApiResponse {
  message: string;
}

export default function ViewClient({ buildings, selectedBuilding, selectedFloor }: ViewClientProps) {
  const router = useRouter();

  const [isWorkplaceModalOpen, setIsWorkplaceModalOpen] = useState(false);
  const [editingWorkplace, setEditingWorkplace] = useState<any>(null);
  const [isOfficeModalOpen, setIsOfficeModalOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState<any>(null);

  const [modalState, setModalState] = useState<{
    type: string | null;
    isOpen: boolean;
    initialData?: any;
  }>({ type: null, isOpen: false });

  const openModal = (type: string, data?: any) => {
    setModalState({ type, isOpen: true, initialData: data });
  };

  const getLink = (params: { buildingId?: number; floorId?: number }) => {
    const search = new URLSearchParams();
    if (params.buildingId) search.set('buildingId', params.buildingId.toString());
    if (params.floorId) search.set('floorId', params.floorId.toString());
    return `/view?${search.toString()}`;
  };

  const handleAddOffice = () => {
    setEditingOffice(null);
    setIsOfficeModalOpen(true);
  }
  const handleAddWorkplace = () => {
    setEditingWorkplace(null);
    setIsWorkplaceModalOpen(true);
  };

    const handleEditOffice = (office: any) => {
    setEditingOffice(office);
    setIsOfficeModalOpen(true);
  };
  const handleEditWorkplace = (workplace: any) => {
    setEditingWorkplace(workplace);
    setIsWorkplaceModalOpen(true);
  };

  const handleWorkplaceModalSuccess = () => {
    router.refresh();
    setIsWorkplaceModalOpen(false);
    setEditingWorkplace(null);
  };
  const handleOfficeModalSuccess = () => {
    router.refresh();
    setIsOfficeModalOpen(false);
    setEditingOffice(null);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Боковая панель со зданиями */}
        <div className="col-md-3 sidebar" style={{ backgroundColor: 'var(--bs-secondary-bg)', height: '100vh', padding: 20, borderRight: '1px solid var(--bs-border-color)' }}>
          <h4 className="mb-4">Здания</h4>
          <ul className="nav nav-pills flex-column mb-auto">
            {buildings.map((b) => (
              <li className="nav-item" key={b.id}>
                <Link
                  href={getLink({ buildingId: b.id })}
                  className={`nav-link ${selectedBuilding?.id === b.id ? 'active' : 'text-body-secondary'}`}
                >
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Основной контент */}
        <div className="col-md-9 content" style={{ padding: 20 }}>
          {selectedBuilding ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Здание: {selectedBuilding.name}</h1>
                <button
                  className="btn btn-primary"
                  onClick={handleAddWorkplace}
                >
                  <i className="bi bi-plus-lg"></i> Добавить рабочее место
                </button>
              </div>

              {/* Вкладки этажей */}
              {selectedBuilding.floors?.length > 0 && (
                <ul className="nav nav-tabs mb-4">
                  {selectedBuilding.floors.map((floor: any) => (
                    <li className="nav-item" key={floor.id}>
                      <Link
                        href={getLink({ buildingId: selectedBuilding.id, floorId: floor.id })}
                        className={`nav-link ${selectedFloor?.id === floor.id ? 'active' : ''}`}
                      >
                        {floor.floorNum}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {selectedFloor && (
                <>
                  <h3>Рабочие места на этаже "{selectedFloor.floorNum}"</h3>
                  <p className="small text-body-secondary">Нажмите на рабочее место, чтобы увидеть детали</p>

                  {selectedFloor.offices?.map((office: any) => (
                    office.workplaces?.length > 0 && (
                      <div key={office.id} className="card shadow-sm border-0 mb-4 rounded-4 overflow-hidden bg-secondary-subtle">
                        <div className="card-header bg-body border-0 pt-3 px-3 pb-0">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 p-1 rounded-2 me-2">
                              <i className="bi bi-building text-primary fs-6"></i>
                            </div>
                            <h6 className="mb-0 fw-semibold text-body">{office.name || 'Офис'}</h6>
                            {office.id && (
                              <button
                                className="btn btn-xs btn-outline-secondary border-0 p-0 ms-2"
                                onClick={handleEditOffice}
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="accordion accordion-flush" id={`accordion-office-${office.id}`}>
                          {office.workplaces.map((wp: any) => (
                            <div key={wp.id} className="accordion-item">
                              <h2 className="accordion-header d-flex justify-content-between align-items-center pe-3">
                                <button
                                  className="accordion-button collapsed text-body"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target={`#wp-${wp.id}`}
                                >
                                  <strong>{wp.name}</strong> &nbsp;
                                  <span className="text-body-secondary">
                                    ({wp.user?.fullName ?? 'Свободно'})
                                  </span>
                                </button>
                                <button
                                  className="btn btn-xs btn-outline-secondary border-0 p-0 ms-2"
                                  onClick={() => handleEditWorkplace(wp)}
                                >
                                  <i className="bi bi-pencil-square"></i>
                                </button>
                              </h2>
                              <div
                                id={`wp-${wp.id}`}
                                className="accordion-collapse collapse"
                                data-bs-parent={`#accordion-office-${office.id}`}
                              >
                                <div className="accordion-body bg-body-tertiary">
                                  <WorkplaceDetails
                                    workplaceId={wp.id}
                                    userSettings={{ defaultPCConnection: 'VNC10', thinkConnection: 'WTRC' }}
                                    onHardwareInfo={(pc) => openModal('hardware', pc)}
                                    onRequestUpdate={async (hostname) => {
                                      try {
                                        const result = await apiFetch<ApiResponse>(`/api/hardware/request-update/${hostname}`, {
                                          method: 'POST'
                                        });
                                        alert(`✅ Запрос отправлен: ${result.message}`);
                                      } catch (error: any) {
                                        alert(`❌ Ошибка агента: ${error.message || 'Нет связи'}`);
                                      }
                                    }}
                                    onUpdateCounters={async (printerId) => {
                                      if (!confirm('Обновить счетчики страниц сейчас?')) return;
                                      try {
                                        const result = await apiFetch<ApiResponse>(`/api/printer/${printerId}/update-counters`, {
                                          method: 'POST'
                                        });
                                        alert(`✅ ${result.message}`);
                                      } catch (error: any) {
                                        alert(`❌ Ошибка: ${error.message || 'Сервер отклонил запрос'}`);
                                      }
                                    }}
                                    onFuserRepair={async (printerId) => {
                                      if (!confirm('Вы подтверждаете сброс ресурса печи (Fuser) после ремонта?')) return;
                                      try {
                                        const result = await apiFetch<ApiResponse>(`/api/printer/${printerId}/repair-fuser`, {
                                          method: 'POST'
                                        });
                                        alert(`🔧 ${result.message}`);
                                      } catch (error: any) {
                                        alert(`❌ Ошибка: ${error.message || 'Не удалось записать данные'}`);
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </>
              )}
            </>
          ) : (
            <p>Выберите здание слева</p>
          )}
        </div>
      </div>

      <HardwareInfoModal
        pc={modalState.initialData}
        show={modalState.isOpen && modalState.type === 'hardware'}
        onClose={() => setModalState({ type: null, isOpen: false })}
      />

      <WorkplaceModal
        isOpen={isWorkplaceModalOpen}
        onClose={() => setIsWorkplaceModalOpen(false)}
        onSuccess={handleWorkplaceModalSuccess}
        initialData={editingWorkplace}
      />

      <OfficeModal
        isOpen={isOfficeModalOpen}
        onClose={() => setIsOfficeModalOpen(false)}
        onSuccess={handleOfficeModalSuccess}
        initialData={editingOffice}
      />
    </div>
  );
}