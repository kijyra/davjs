'use client';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="modal-backdrop fade show" 
        style={{ zIndex: 1050, backdropFilter: 'blur(6px)', opacity: 0.6 }} 
        onClick={onClose}
      />
      
      <div 
        className="modal fade show d-block" 
        style={{ zIndex: 1055 }} 
        tabIndex={-1} 
        role="dialog"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content shadow-lg border-secondary-subtle">
            
            <div className="modal-header border-bottom-0 pt-4 px-4">
              <h4 className="modal-title fw-bold d-flex align-items-center">
                <i className="bi bi-info-square-fill text-primary me-3"></i>
                Настройка подключений
              </h4>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>

            <div className="modal-body px-4 pb-4">
              <div className="p-3 mb-4 rounded-3 border-start border-primary border-4 bg-body-secondary text-body">
                <h6 className="fw-bold mb-2">Зачем это нужно?</h6>
                <p className="small mb-0 opacity-75">
                  Для корректной работы ссылок на странице <b>Рабочие места</b> и подключения в один клик 
                  требуется установка специальных обработчиков ссылок.
                </p>
              </div>

              <h6 className="fw-bold mb-3 small text-uppercase opacity-50">Типы подключений:</h6>

              <div className="d-flex flex-column gap-3">
                
                {/* VNC Block */}
                <div className="card bg-body-tertiary border-secondary-subtle shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="fw-bold text-primary mb-0">VNC Connection</h6>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle">vnc://</span>
                    </div>
                    <p className="small text-body-secondary mb-3">
                      Требует установленный VncTrayApp на клиентском (вашем ПК) и сервер TightVNC на удалённом ПК.
                    </p>
                    <div className="p-2 rounded mb-3 bg-dark-subtle border border-secondary-subtle">
                      <code className="small">PWD (просмотр): 555666 | PWD (управление): 233566</code>
                    </div>
                    <a href="https://dc1.dallari.biz:3001/Files/DownloadPrivateFile?fileName=VncUriHandlerInstall.msi" className="btn btn-sm btn-outline-primary w-100 fw-medium">
                      <i className="bi bi-download me-2"></i>Установить Handler (MSI)
                    </a>
                  </div>
                </div>

                {/* Anydesk Block */} 
                <div className="card bg-body-tertiary border-secondary-subtle shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="fw-bold text-danger mb-0">AnyDesk</h6>
                      <span className="badge bg-danger-subtle text-danger border border-danger-subtle">anydesk://</span>
                    </div>
                    <p className="small text-body-secondary mb-3">
                      Рекомендуется версия 5.4.2 для обхода лимитов сессий.
                    </p>
                    <a href="https://dc1.dallari.biz:3001/Files/DownloadPrivateFile?fileName=anydesk-5-4-2.exe" className="btn btn-sm btn-outline-danger w-100 fw-medium">
                      <i className="bi bi-download me-2"></i>Скачать AnyDesk.exe
                    </a>
                  </div>
                </div>

                {/* WTRC Block */}
                <div className="card bg-body-tertiary border-secondary-subtle shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="fw-bold text-success mb-0">WTRC (WTware)</h6>
                      <span className="badge bg-success-subtle text-success border border-success-subtle">Thin Client</span>
                    </div>
                    <p className="small text-body-secondary mb-3">
                      Только для тонких клиентов. Требует прописанный IP в конфиге WTware. Для тонких клиентов работает и VNC.
                    </p>
                    <div className="d-flex gap-2">
                      <a href="https://dc1.dallari.biz:3001/Files/DownloadPrivateFile?fileName=setup.wtrc.exe" className="btn btn-sm btn-outline-success flex-grow-1 fw-medium">
                        <i className="bi bi-download me-2"></i>Скачать wtrc.exe
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="modal-footer border-0 pb-4">
              <button type="button" className="btn btn-secondary px-4 fw-medium" onClick={onClose}>
                Понятно
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
