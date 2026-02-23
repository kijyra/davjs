'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import WorkplaceDetails from '@/components/View/WorkplaceDetails';
import { useState } from 'react';

interface ViewClientProps {
  buildings: { id: number; name: string }[];
  selectedBuilding: any;
  selectedFloor: any;
}

export default function ViewClient({ buildings, selectedBuilding, selectedFloor }: ViewClientProps) {
  const router = useRouter();


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
                  onClick={() => {
                    // TODO: открыть модалку добавления рабочего места
                    alert('Добавить рабочее место (будет реализовано позже)');
                  }}
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
                                onClick={() => {
                                  // TODO: открыть модалку редактирования офиса
                                  alert('Редактировать офис');
                                }}
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
                                  onClick={() => {
                                    // TODO: открыть модалку редактирования рабочего места
                                    alert('Редактировать рабочее место');
                                  }}
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
                                    workplace={wp}
                                    userSettings={{ defaultPCConnection: 'VNC10', thinkConnection: 'WTRC' }} // получите из API или контекста
                                    onEditUser={(user) => openModal('user', user)}
                                    onEditPhone={(phone) => openModal('phone', phone)}
                                    onEditPC={(pc) => openModal('pc', pc)}
                                    onEditPrinter={(printer) => openModal('printer', printer)}
                                    onHardwareInfo={(pc) => openModal('hardware', pc)}
                                    onRequestUpdate={(hostname) => {
                                      // вызвать API для обновления
                                      console.log('Обновить ПК', hostname);
                                    }}
                                    onUpdateCounters={(printerId) => {
                                      // вызвать API для обновления счётчиков
                                      console.log('Обновить счётчики', printerId);
                                    }}
                                    onFuserRepair={(printerId) => {
                                      // вызвать API для ремонта печи
                                      console.log('Ремонт печи', printerId);
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
    </div>
  );
}