import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import './Layout.scss';

export default function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  return (
    <div className="layout-container">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      <div className={`layout-content ${isSidebarCollapsed ? 'collapsed' : 'expanded'}`}>
        <Header />
        <main className="main-viewport">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
