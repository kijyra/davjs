import './global.css';
import type { Metadata } from 'next';
import HeaderComponent from '../components/header'; 
import { ThemeProvider } from './context/ThemeContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapClient from '../components/BootstrapClient';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: 'Главная | davproj', 
  description: 'Описание проекта',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru"> 
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>
          <BootstrapClient />
          <HeaderComponent />
          
          <div className="container">
            <main role="main" className="pb-3">
              {children}
            </main>
          </div>

          <footer className="border-top footer text-muted">
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
