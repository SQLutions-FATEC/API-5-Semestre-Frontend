import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import './Sidebar.scss';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  const navItems = [
    { name: 'Visão Geral', path: '/', icon: LayoutDashboard },
    { name: 'Compras', path: '/compras', icon: ShoppingCart }
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <div className={`sidebar-header ${isCollapsed ? 'centered' : ''}`}>
        <div className="logo-box">S</div>
        {!isCollapsed && <span className="brand-name">SIATT</span>}
      </div>

      <button onClick={onToggle} className="toggle-button">
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <nav className="nav-section">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              title={isCollapsed ? item.name : undefined}
              className={`nav-item ${isActive ? 'active' : ''} ${isCollapsed ? 'centered' : ''}`}
            >
              <Icon size={20} className="icon" />
              {!isCollapsed && <span className="label">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* <div className="sidebar-footer">
        <Link
          to="/help"
          className={`nav-item ${location.pathname === '/help' ? 'active' : ''} ${isCollapsed ? 'centered' : ''}`}
        >
          <HelpCircle size={20} className="icon" />
          {!isCollapsed && <span className="label">Ajuda</span>}
        </Link>
      </div> */}
    </aside>
  );
}
