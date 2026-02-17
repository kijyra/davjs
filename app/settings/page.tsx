'use client';

import { useState, useEffect } from 'react';
import { ADUser } from '../types/index';
import { apiFetch } from '../../services/api';

import InstructionsModal from '../../components/Settings/InstructionModal'
import ReportsModal from '../../components/Settings/ReportsModal';
import UserSettingsModal from '../../components/Settings/UserSettingsModal';

export default function SettingsPage() {
  const [user, setUser] = useState<ADUser | null>(null);
  const [loading, setLoading] = useState(true);
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

useEffect(() => {
      apiFetch<ADUser>('/api/home/profile')
      .then(data => {
        console.log("Получены данные (data):", data);
        if (data) {
            setUser(data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Ошибка при получении данных:", error);
        setLoading(false);
      });
}, []);

  if (loading) return <div className="text-center py-5">Загрузка...</div>;
  if (!user) return <div className="text-center py-5">Пользователь {} не найден</div>;

  const login = user.cn;
  const avatarLetter = user.givenName?.charAt(0).toUpperCase() || '?';

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* ЛЕВАЯ КОЛОНКА: КАРТОЧКА ПРОФИЛЯ */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <div 
                className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                style={{ width: '80px', height: '80px', fontSize: '2rem' }}
              >
                {avatarLetter}
              </div>
              <h4 className="mb-0">{user?.givenName}</h4>
              <p className="text-muted small">@{login}</p>
              
              <div className="d-flex justify-content-center align-items-center gap-2 mb-4">
                {user.admin && (
                  <>
                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                      Администратор
                    </span>
                    <a href="/dbadmin" className="text-muted" title="Управление БД">
                      <i className="bi bi-database fs-6"></i>
                    </a>
                  </>
                )}
                <span className="badge bg-success-subtle text-success border border-success-subtle">
                  Активен
                </span>
              </div>

              <div className="d-grid gap-2">
                  <button 
                    className={`btn btn-outline-primary ${!user.admin ? 'disabled' : ''}`}
                    onClick={() => setIsSettingsOpen(true)}
                  >
                    Настройки профиля
                  </button>
                  {user.admin && (
                    <button 
                      className="btn btn-link btn-sm text-decoration-none"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Как подключиться?
                    </button>
                  )}
              </div>
            </div>

            <hr className="mx-3 my-0" />

            <div className="card-body">
              <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem' }}>
                Детали учетной записи
              </small>
              <ul className="list-unstyled mt-2 mb-0">
                <li className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Логин:</span>
                  <span className="fw-medium">{login}</span>
                </li>
                <li className="d-flex justify-content-between">
                  <span className="text-muted">Домен:</span>
                  <span className="fw-medium">DALLARI.BIZ</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА: ГРУППЫ AD */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-transparent border-0 pt-3 px-4 d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Группы доступа AD</h5>
              {user.admin && (
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setIsReportsOpen(true)}
                >
                  <i className="bi bi-file-earmark-bar-graph me-1"></i> Отчёты
                </button>
              )}
            </div>
            <div className="card-body px-4">
              <div className="d-flex flex-wrap gap-2">
                {user?.group?.map((group, idx) => (
                  <div key={idx} className="p-2 border rounded bg-body-tertiary d-flex align-items-center">
                    <i className="bi bi-people text-body-secondary me-2"></i>
                    <span style={{ fontSize: '0.9rem' }}>{group}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <InstructionsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      <ReportsModal 
        isOpen={isReportsOpen} 
        onClose={() => setIsReportsOpen(false)} 
      />
      <UserSettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        currentUser={user.cn}
        initialSettings={{ pc: 'VNC10', thin: 'WTRC' }}
      />
    </div>
  );
}