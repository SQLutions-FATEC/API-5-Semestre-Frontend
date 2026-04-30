import { Link, useLocation, useMatch } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import './Sidebar.scss';

interface SidebarProps {
  readonly isCollapsed: boolean;
  readonly onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const match = useMatch('/programas/:programa_cod/projetos/:codigo_projeto/*');
  const programa_cod = match?.params?.programa_cod;
  const codigo_projeto = match?.params?.codigo_projeto;

  // Only show links that require a project if we have a project context
  const navItems =
    codigo_projeto && programa_cod
      ? [
          {
            name: 'Visão Geral',
            path: `/programas/${programa_cod}/projetos/${codigo_projeto}`,
            icon: LayoutDashboard,
          },
          {
            name: 'Compras',
            path: `/programas/${programa_cod}/projetos/${codigo_projeto}/compras`,
            icon: ShoppingCart,
          },
        ]
      : [];

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
