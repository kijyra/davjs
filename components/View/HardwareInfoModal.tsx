'use client';

import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

// Типы (можно вынести в отдельный файл)
interface MonitorSpecs {
  model: string;
  diagonal: string;
  serial: string;
}

interface HardwareInfo {
  id: number;
  computerName: string;
  processorName: string;
  monitorInfo: string;
  totalMemoryGB: number;
  videoCard: string;
  osVersion: string;
  diskInfo: string;
  diskType: string;
  serialNumber: string;
  totalRamSlots: number;
  usedRamSlots: number;
  ramType: string;
  ramManufacturer: string;
  isDomainJoined: boolean;
  ipAddress: string;
  collectedAtUtc: string;
  motherboardModel: string;
  currentUserName: string;
  ramSpeed: string;
  diskHealth: string;
  antivirus: string;
  uptime: string;
  softwareList: string[];
  usbDevices: string[];
  printers: string[];
  openPorts: string[];
  pendingUpdatesCount: number;
  lastUpdateDate: string;
}

interface PC {
  id: number;
  hostname: string;
  ip: string;
  domain: boolean;
  think: boolean;
  anydesk?: string;
  currentHardwareInfo: HardwareInfo | null;
  displayList?: MonitorSpecs[];
}

interface HardwareInfoModalProps {
  pc: PC | null;
  show: boolean;
  onClose: () => void;
}

export default function HardwareInfoModal({ pc, show, onClose }: HardwareInfoModalProps) {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const handleRequestUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/hardware/request-update/${pc?.hostname}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ ${data.message}`);
      } else {
        alert(`❌ Ошибка: ${data.message || 'Агент недоступен'}`);
      }
    } catch (error) {
      alert('❌ Не удалось связаться с сервером');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!pc || !pc.currentHardwareInfo) return null;

  const info = pc.currentHardwareInfo;

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>🖥 Сведения о системе: {pc.hostname}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row g-3">
          {/* Система */}
          <div className="col-md-6">
            <h6 className="border-bottom pb-2">Система</h6>
            <p className="mb-1 small">OS: <strong>{info.osVersion}</strong></p>
            <p className="mb-1 small">Пользователь: <strong>{info.currentUserName}</strong></p>
            <p className="mb-1 small">IP: <strong>{info.ipAddress}</strong> (ID: {pc.id})</p>
            <p className="mb-1 small">Плата: <strong>{info.motherboardModel}</strong></p>
            <p className="mb-1 small">Uptime: <strong>{info.uptime}</strong></p>
          </div>

          {/* Конфигурация */}
          <div className="col-md-6">
            <h6 className="border-bottom pb-2">Конфигурация</h6>
            <p className="mb-1 small">CPU: <strong>{info.processorName}</strong></p>
            <p className="mb-1 small">GPU: <strong>{info.videoCard}</strong></p>
            <p className="mb-1 small">
              Monitor:
              {pc.displayList && pc.displayList.length > 0 ? (
                pc.displayList.map((m, idx) => (
                  <React.Fragment key={idx}>
                    <br />
                    <span className="ms-2">
                      <i className="bi bi-display text-primary"></i>
                      <strong> {m.model}</strong>
                      <span className="badge border"> {m.diagonal}"</span>
                      <code className="text-muted small"> [{m.serial}]</code>
                    </span>
                  </React.Fragment>
                ))
              ) : (
                <strong> Не найден</strong>
              )}
            </p>
            <p className="mb-1 small">
              RAM: <strong>{info.totalMemoryGB} GB {info.ramType} ({info.usedRamSlots}/{info.totalRamSlots} slots)</strong>
            </p>
            <p className="mb-1 small">
              Disk: <strong>{info.diskInfo}</strong> ({info.diskHealth})
            </p>
          </div>

          {/* Безопасность */}
          <div className="col-12">
            <div className="alert alert-info py-2 d-flex justify-content-between align-items-center">
              <span>🛡 Antivirus: <strong>{info.antivirus}</strong></span>
              <span>🔄 Обновления: <strong>{info.pendingUpdatesCount}</strong> (Last: {info.lastUpdateDate})</span>
            </div>
          </div>

          {/* Аккордеон со списками */}
          <div className="col-12 text-small">
            <div className="accordion accordion-flush shadow-sm border" id="pcLists">
              {/* ПО */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button py-2 ${activeAccordion !== 'soft' ? 'collapsed' : ''}`}
                    type="button"
                    onClick={() => toggleAccordion('soft')}
                  >
                    ПО и Софт
                  </button>
                </h2>
                <div className={`accordion-collapse collapse ${activeAccordion === 'soft' ? 'show' : ''}`}>
                  <div className="accordion-body small">
                    {info.softwareList && info.softwareList.length > 0 ? (
                      <ul className="list-unstyled">
                        {info.softwareList.map((soft, idx) => (
                          <li key={idx} className="border-bottom py-1">🔹 {soft}</li>
                        ))}
                      </ul>
                    ) : (
                      <span>Список пуст</span>
                    )}
                  </div>
                </div>
              </div>

              {/* USB и Принтеры */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button py-2 ${activeAccordion !== 'usb' ? 'collapsed' : ''}`}
                    type="button"
                    onClick={() => toggleAccordion('usb')}
                  >
                    USB и Принтеры
                  </button>
                </h2>
                <div className={`accordion-collapse collapse ${activeAccordion === 'usb' ? 'show' : ''}`}>
                  <div className="accordion-body small">
                    <h6>USB:</h6>
                    {info.usbDevices && info.usbDevices.length > 0 ? (
                      <ul className="list-unstyled">
                        {info.usbDevices.map((usb, idx) => (
                          <li key={idx} className="border-bottom py-1">🔹 {usb}</li>
                        ))}
                      </ul>
                    ) : (
                      <span>Список пуст</span>
                    )}
                    <h6 className="mt-2">Принтеры:</h6>
                    {info.printers && info.printers.length > 0 ? (
                      <ul className="list-unstyled">
                        {info.printers.map((printer, idx) => (
                          <li key={idx} className="border-bottom py-1">🔹 {printer}</li>
                        ))}
                      </ul>
                    ) : (
                      <span>Список пуст</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
        <Modal.Footer>
          <small className="text-muted me-auto">Обновлено: {info.collectedAtUtc}</small>
          
          <button 
            type="button" 
            className="btn btn-outline-primary btn-sm me-2" 
            onClick={handleRequestUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <span className="spinner-border spinner-border-sm me-1"></span>
            ) : '📡 '}
            Обновить данные
          </button>

          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Закрыть
          </button>
        </Modal.Footer>
    </Modal>
  );
}