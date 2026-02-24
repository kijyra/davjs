'use client';

import React from 'react';
import { CONNECTION_OPTIONS, CONNECTION_URLS } from '../../constants/connections';
import { useVnc } from '../../hooks/usevnc';
import { apiFetch } from '@/services/api';

interface WorkplaceDetailsProps {
  workplace: any;
  userSettings?: {
    defaultPCConnection: string;
    thinkConnection: string;
  };
  onEditUser?: (user: any) => void;
  onEditPhone?: (phone: any) => void;
  onEditPC?: (pc: any) => void;
  onEditPrinter?: (printer: any) => void;
  onHardwareInfo?: (pc: any) => void;
  onRequestUpdate?: (hostname: string) => void;
  onUpdateCounters?: (printerId: number) => void;
  onFuserRepair?: (printerId: number) => void;
}

export default function WorkplaceDetails({
  workplace,
  userSettings = { defaultPCConnection: 'VNC10', thinkConnection: 'WTRC' },
  onEditUser,
  onEditPhone,
  onEditPC,
  onEditPrinter,
  onHardwareInfo,
  onRequestUpdate,
  onUpdateCounters,
  onFuserRepair,
}: WorkplaceDetailsProps) {
  const { user, phone, pc, printer } = workplace;
  
  const { connectVnc } = useVnc();
  
  const renderMonitors = () => {
    if (!pc?.displayList?.length) return '—';
    const groups = pc.displayList.reduce((acc: any, m: any) => {
      acc[m.diagonal] = (acc[m.diagonal] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(groups).map(([diag, count]) => `${count}x ${diag}"`).join(', ');
  };

  const diskHealthClass = (health: string) => {
    if (health === 'OK') return 'text-success';
    if (health === 'Warning') return 'text-warning';
    return 'text-danger';
  };

  const getConnectionUrl = (connType: string, ip: string) => {
    const baseUrl = CONNECTION_URLS[connType];
    return baseUrl ? baseUrl + ip : '#';
  };

  const handleVNCConnect = async (pcId: number, fullControl: boolean, requestUser: boolean) => {
    try {
      const result = await apiFetch<any>('/api/VNC/Connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pcId, fullControl, requestUser })
      });
      if (result.uri) {
        window.location.href = result.uri;
      }
    } catch (error) {
      console.error('VNC connection failed:', error);
      alert('Не удалось подключиться к ПК');
    }
  };

  return (
    <div className="accordion-body bg-body-tertiary">
      <div className="row">
        {/* Левая колонка: пользователь и телефон */}
        <div className="col-md-4 d-flex flex-column">
          {/* Карточка пользователя */}
          <div className="card flex-grow-1 border-0 shadow-sm bg-body mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-primary fw-bold mb-0">
                  <i className="bi bi-person me-1"></i> Пользователь
                </h6>
                {user && onEditUser && (
                  <button
                    className="btn btn-xs btn-outline-secondary border-0 p-0"
                    onClick={() => onEditUser(user)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                )}
              </div>
              <div className="mb-3">
                <div className="fw-bold text-truncate">{user?.fullName ?? 'Нет данных'}</div>
                <div className="text-body-secondary small mb-2">{user?.position ?? 'Нет данных'}</div>
                <div className="row small">
                  <div className="col-5 text-body-secondary">
                    <i className="bi bi-person-badge me-1"></i>DALLARI\
                  </div>
                  <div className="col-7 fw-bold text-end">
                    {user?.adUser?.cn?.toLowerCase() ?? 'Нет данных'}
                  </div>
                </div>
              </div>
              <div className="d-grid">
                {user?.bitrix && (
                  <a
                    href={user.bitrixPath} // предполагаем, что API возвращает полный URL
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary"
                  >
                    Профиль
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Карточка телефона */}
          <div className="card flex-grow-1 border-0 shadow-sm bg-body">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="text-primary fw-bold mb-0">
                  <i className="bi bi-telephone me-1"></i> Телефон
                </h6>
                {phone && onEditPhone && (
                  <button
                    className="btn btn-xs btn-outline-secondary border-0 p-0"
                    onClick={() => onEditPhone(phone)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                )}
              </div>
              <div className="mb-3">
                <div className="fw-bold text-body">{phone?.model ?? 'Нет данных'}</div>
                <div className="text-body-secondary small">
                  <i className="bi bi-globe me-1"></i> IP:{' '}
                  <span className="text-body">{phone?.ip ?? '—'}</span>
                </div>
                <div className="text-body-secondary small">
                  <i className="bi bi-telephone me-1"></i> Номер:{' '}
                  <span className="text-body">{phone?.number ?? '—'}</span>
                </div>
              </div>
              {phone?.handset && (
                <div className="bg-body-tertiary rounded p-2 mb-3 small text-body-secondary">
                  <i className="bi bi-headset me-1"></i> Имя трубки в базе: {phone?.nameInBase}
                </div>
              )}
              <div className="d-grid gap-2">
                {phone && (
                  <a
                    href={`http://${phone.ip}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-secondary"
                  >
                    WEB
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Правая колонка: компьютер и принтер */}
        <div className="col-md-8">
          <div className="row">
            {/* Карточка компьютера */}
            <div className="col-md-6 mb-3">
              <div className="card flex-grow-1 border-0 shadow-sm bg-body h-100">
                <div className="card-body">
                  {!pc ? (
                    <>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="text-primary fw-bold mb-0">
                          <i className="bi bi-laptop me-1"></i> Компьютер
                        </h6>
                      </div>
                      <p className="card-text">Данные о компьютере отсутствуют.</p>
                      <button className="btn btn-dark disabled mt-3" disabled>
                        Обновить
                      </button>
                      <div className="card-footer mt-3">Нет данных о домене</div>
                    </>
                  ) : (
                    <>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="text-primary fw-bold mb-0">
                          <i className="bi bi-laptop me-1"></i> Компьютер
                        </h6>
                        {onEditPC && (
                          <button
                            className="btn btn-xs btn-outline-secondary border-0 p-0"
                            onClick={() => onEditPC(pc)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                        )}
                      </div>

                      <div className="mb-3">
                        <div className="small">
                          <span className="text-body-secondary">Hostname:</span>{' '}
                          <span className="fw-bold">{pc.hostname ?? 'Нет данных'}</span>
                        </div>
                        <div className="small">
                          <span className="text-body-secondary">IP:</span>{' '}
                          <span className="fw-bold">{pc.ip ?? '—'}</span>
                        </div>
                        <div className="small">
                          <span className="text-body-secondary">Пользователь:</span>{' '}
                          <span className="fw-bold">{pc.currentHardwareInfo?.currentUserName ?? '—'}</span>
                        </div>
                      </div>

                      <div className="bg-body-tertiary rounded p-2 mb-2">
                        <div className="row small mb-1">
                          <div className="col-6 text-body-secondary">Мониторы:</div>
                          <div className="col-6 text-end fw-bold">
                            <i className="bi bi-display me-1"></i>
                            {renderMonitors()}
                          </div>
                        </div>

                        <div className="row small mb-1">
                          <div className="col-6 text-body-secondary">ОЗУ:</div>
                          <div className="col-6 text-end fw-bold">
                            {pc.currentHardwareInfo ? (
                              <>
                                {pc.currentHardwareInfo.totalMemoryGB} GB{' '}
                                {pc.currentHardwareInfo.ramType} (
                                {pc.currentHardwareInfo.usedRamSlots}/
                                {pc.currentHardwareInfo.totalRamSlots})
                              </>
                            ) : (
                              '—'
                            )}
                          </div>
                        </div>

                        <div className="row small mb-1">
                          <div className="col-6 text-body-secondary">Занято HDD:</div>
                          <div
                            className={`col-6 text-end fw-bold ${diskHealthClass(
                              pc.currentHardwareInfo?.diskHealth
                            )}`}
                          >
                            {pc.currentHardwareInfo ? (
                              <>
                                <i
                                  className="bi bi-circle-fill me-1"
                                  style={{ fontSize: '0.5rem' }}
                                ></i>
                                {pc.currentHardwareInfo.diskInfo} (
                                {pc.currentHardwareInfo.diskType})
                              </>
                            ) : (
                              '—'
                            )}
                          </div>
                        </div>
                      </div>

                      {!pc.think && (
                        <div className="btn-group w-100 mb-3" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary w-100 py-0"
                            style={{ fontSize: '0.75rem' }}
                            onClick={() => onRequestUpdate?.(pc.hostname)}
                          >
                            <i className="bi bi-arrow-repeat"></i> Обновить
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary py-0"
                            style={{ fontSize: '0.75rem' }}
                            onClick={() => onHardwareInfo?.(pc)}
                          >
                            ИНФО
                          </button>
                        </div>
                      )}

                      <div className="bg-body-tertiary rounded p-2 mb-3">
                        <div
                          className={`small fw-bold ${
                            pc.domain ? 'text-success' : 'text-danger'
                          }`}
                        >
                          <i
                            className="bi bi-circle-fill"
                            style={{ fontSize: '0.5rem' }}
                          ></i>
                          {pc.domain
                            ? 'В домене'
                            : pc.think
                            ? 'Тонкий клиент'
                            : 'Не в домене'}
                        </div>
                      </div>

                      {/* Кнопка подключения с выпадающим списком */}
                      <div className="d-grid">
                          {/* Кнопка с выпадающим списком */}
                          <div className="btn-group">
                            {(() => {
                              const defaultConn = pc.think
                                ? userSettings.thinkConnection
                                : userSettings.defaultPCConnection;
                              const defaultUrl = getConnectionUrl(defaultConn, pc.ip);
                              return (
                                <>
                                  <a href={defaultUrl} className="btn btn-sm btn-outline-primary">
                                    {CONNECTION_OPTIONS[defaultConn] || defaultConn}
                                  </a>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary dropdown-toggle dropdown-toggle-split"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <span className="visually-hidden">Toggle Dropdown</span>
                                  </button>
                                  <div className="dropdown-menu">
                                    {Object.entries(CONNECTION_OPTIONS).map(([key, label]) => {
                                      if (key === defaultConn) return null;

                                      const isWtrcOrWeb = key === 'WTRC' || key === 'WEB';
                                      const isVnc = key.startsWith('VNC');

                                      if (pc.think) {
                                        if (!isWtrcOrWeb && !isVnc) return null;
                                        if (key.endsWith('1')) return null;
                                      } else {
                                        if (isWtrcOrWeb) return null;
                                      }

                                      if (isVnc) {
                                        const control = key[3] === '1';
                                        const prompt = key[4] === '1';
                                        return (
                                          <a
                                            key={key}
                                            className="dropdown-item"
                                            href="#"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              connectVnc(pc.id, pc.ip, control, prompt);
                                            }}
                                          >
                                            {label}
                                          </a>
                                        );
                                      } else {
                                        const href = getConnectionUrl(key, pc.ip);
                                        return (
                                          <a key={key} className="dropdown-item" href={href}>
                                            {label}
                                          </a>
                                        );
                                      }
                                    })}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Карточка принтера */}
            <div className="col-md-6 mb-3">
              <div className="card flex-grow-1 border-0 shadow-sm bg-body h-100">
                <div className="card-body">
                  {printer ? (
                    <>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="text-primary fw-bold mb-0">
                          <i className="bi bi-printer me-1"></i> Принтер
                        </h6>
                        {onEditPrinter && (
                          <button
                            className="btn btn-xs btn-outline-secondary border-0 p-0"
                            onClick={() => onEditPrinter(printer)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                        )}
                      </div>
                      <div className="mb-3">
                        <div className="fw-bold small text-truncate text-body">
                          {printer.printerModel?.cartridge?.manufactor?.name}{' '}
                          {printer.printerModel?.name}
                        </div>
                        <div className="text-body-secondary small">
                          Картридж:{' '}
                          <span className="text-body">
                            {printer.printerModel?.cartridge?.model ?? '—'}
                          </span>
                        </div>
                      </div>
                      <div className="bg-body-tertiary rounded p-2 mb-3">
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="text-body-secondary">Печать:</span>
                          <span className="fw-bold text-body">
                            {printer.printCount ?? 0}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="text-body-secondary">Сканы:</span>
                          <span className="fw-bold text-body">
                            {printer.scanCount ?? 0}
                          </span>
                        </div>
                        <div
                          className="border-top mt-1 pt-1 text-body-secondary"
                          style={{ fontSize: '0.7rem' }}
                        >
                          <i className="bi bi-clock-history"></i>{' '}
                          {printer.lastUpdateSNMP ?? 'Не обновлялось'}
                        </div>
                      </div>
                      <div className="d-grid gap-2">
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary w-100 py-0"
                            style={{ fontSize: '0.75rem' }}
                            onClick={() => onUpdateCounters?.(printer.id)}
                          >
                            <i className="bi bi-arrow-repeat"></i> Счётчики
                          </button>
                          <a
                            href={`https://${printer.hostName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-secondary py-0"
                            style={{ fontSize: '0.75rem' }}
                          >
                            WEB
                          </a>
                        </div>
                        <div className="d-flex align-items-center justify-content-between border-top pt-2">
                          <span className="text-body-secondary" style={{ fontSize: '0.7rem' }}>
                            Печь:{' '}
                            {printer.lastFuserRepair?.length > 0
                              ? printer.lastFuserRepair[printer.lastFuserRepair.length - 1]
                              : '—'}
                          </span>
                          <button
                            className="btn btn-link btn-sm p-0 text-decoration-none"
                            style={{ fontSize: '0.7rem' }}
                            onClick={() => onFuserRepair?.(printer.id)}
                          >
                            Ремонт
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h6 className="text-primary fw-bold mb-0">
                        <i className="bi bi-printer me-1"></i> Принтер
                      </h6>
                      <p className="text-muted mt-2">
                        Принтер не назначен или недоступен.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}