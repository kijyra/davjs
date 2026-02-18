'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '../app/context/ThemeContext';
import { UserIdentity } from '../app/types';
import { apiFetch } from '../services/api';

export default function HeaderComponent() {
  const [user, setUser] = useState<UserIdentity | null>(null);
  const currentPath = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    apiFetch<UserIdentity>('/api/auth/me')
      .then(data => setUser(data))
      .catch(error => console.error("Ошибка при получении данных пользователя:", error));
  }, []);

  const userNameDisplay = user?.isAuthenticated ? user.userName.split('\\').pop() : 'Войти';

  return (
    <header className="fixed-top">
      <div className="px-3 py-2 bg-body-secondary border-bottom border-bottom-subtle">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-lg-end">
            <ul className="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
              <li>
                <Link 
                  href="/" 
                  className={`nav-link px-2 ${currentPath === '/' ? 'active' : 'text-body-secondary'}`}
                >
                  <i className="bi bi-file-earmark-fill"></i> Главная
                </Link>
              </li>
              {user?.isAuthenticated && (
                <li>
                  <Link 
                    href="/view" 
                    className={`nav-link px-2 ${currentPath === '/view' ? 'active' : 'text-body-secondary'}`} 
                  >
                    <i className="bi bi-person-workspace"></i> Рабочие места
                  </Link>
                </li>
              )}
              <li>
                <Link 
                  href="/settings" 
                  className={`nav-link px-2 ${currentPath === '/settings' ? 'active' : 'text-body-secondary'}`} 
                >
                  <i className="bi bi-sliders2-vertical"></i> {userNameDisplay}
                </Link>
              </li>
              <li>
                <button 
                  className="btn btn-link p-0" 
                  onClick={toggleTheme}
                  title="Toggle theme" 
                  type="button"
                >
                  <i 
                    className={`bi ${theme === 'light' ? 'bi-moon-fill' : 'bi-sun-fill'}`} 
                    id="theme-icon"
                  ></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}