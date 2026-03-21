import { Bell, Search, UserCircle } from 'lucide-react';
import './Header.scss';

export default function Header() {
  return (
    <header className="header">
      <div className="header-search">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar projetos, programas..."
            className="search-input"
          />
        </div>
      </div>

      <div className="header-actions">
        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-badge" />
        </button>

        <div className="divider" />

        <div className="user-info">
          <UserCircle size={32} className="user-avatar" />
          <span className="user-name">Gestor Alpha</span>
        </div>
      </div>
    </header>
  );
}
