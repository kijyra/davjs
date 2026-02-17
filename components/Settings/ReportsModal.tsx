'use client';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const reports = [
  {
    title: 'Полный отчёт',
    desc: 'Содержит все отчёты системы.',
    icon: 'bi-database-fill-check',
    url: 'https://dc1.dallari.biz:3001/Reports/ExportFullInventory',
    color: 'primary'
  },
  {
    title: 'Hardware',
    desc: 'Отчет по техническому обеспечению.',
    icon: 'bi-motherboard',
    url: 'https://dc1.dallari.biz:3001/Reports/ExportHardware',
    color: 'info'
  },
  {
    title: 'Software',
    desc: 'Список установленного ПО.',
    icon: 'bi-window-stack',
    url: 'https://dc1.dallari.biz:3001/Reports/ExportSoftware',
    color: 'warning'
  },
  {
    title: 'Мониторы',
    desc: 'Дисплеи, диагонали и модели.',
    icon: 'bi-display',
    url: 'https://dc1.dallari.biz:3001/Reports/ExportMonitors',
    color: 'success'
  },
  {
    title: 'Принтеры',
    desc: 'Все установленные принтеры.',
    icon: 'bi-printer',
    url: 'https://dc1.dallari.biz:3001/Reports/ExportPrinters',
    color: 'danger'
  },
  {
    title: 'USB Устройства',
    desc: 'История и текущие подключения.',
    icon: 'bi-usb-symbol',
    url: 'https://dc1.dallari.biz:3001/Reports/ExportUsb',
    color: 'secondary'
  },
];

export default function ReportsModal({ isOpen, onClose }: ReportsModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="modal-backdrop fade show" 
        style={{ zIndex: 1060, backdropFilter: 'blur(4px)', opacity: 0.5 }} 
        onClick={onClose}
      />
      
      <div className="modal fade show d-block" style={{ zIndex: 1065 }} tabIndex={-1}>
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 shadow-lg bg-body">
            
            <div className="modal-header border-0 pt-4 px-4">
              <h5 className="modal-title fw-bold d-flex align-items-center">
                <i className="bi bi-file-earmark-bar-graph text-primary me-2"></i>
                Экспорт отчётов (Excel)
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body px-4 pb-4">
              <div className="row g-3">
                {reports.map((report, idx) => (
                  <div className="col-md-4" key={idx}>
                    <div className="card h-100 border-secondary-subtle bg-body-tertiary transition-hover">
                      <div className="card-body d-flex flex-column p-3">
                        <div className={`mb-2 text-${report.color} fs-4`}>
                          <i className={`bi ${report.icon}`}></i>
                        </div>
                        <h6 className="card-title fw-bold small mb-1">{report.title}</h6>
                        <p className="card-text text-muted mb-3" style={{ fontSize: '0.75rem' }}>
                          {report.desc}
                        </p>
                        <a 
                          href={report.url}
                          className={`btn btn-${report.color} btn-sm mt-auto w-100 d-flex align-items-center justify-content-center`}
                        >
                          <i className="bi bi-download me-2"></i> Скачать
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer border-0">
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Закрыть</button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .transition-hover:hover {
          transform: translateY(-3px);
          transition: all 0.2s ease-in-out;
          border-color: var(--bs-primary) !important;
        }
      `}</style>
    </>
  );
}
