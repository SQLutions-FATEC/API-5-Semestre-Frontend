import { Link, useLocation, useMatch } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Package,
  Upload,
  Building2,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'error' | 'success' | 'info' | 'warning'>(
    'error'
  );

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
          {
            name: 'Estoque',
            path: `/programas/${programa_cod}/projetos/${codigo_projeto}/estoque`,
            icon: Package,
          },
          {
            name: 'Fornecedores',
            path: `/programas/${programa_cod}/projetos/${codigo_projeto}/fornecedores`,
            icon: Building2,
          },
        ]
      : [];

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const showToast = (
    message: string,
    severity: 'error' | 'success' | 'info' | 'warning' = 'error'
  ) => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleCloseToast = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      showToast('Erro na seleção: Formato de arquivo não suportado, só é permitido .csv.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      // Simulação de chamada ao backend
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await api.post('/upload-csv', formData);

      console.log('Arquivo pronto para envio:', file.name);
    } catch (error: any) {
      const errorMessage = error?.message || 'Erro desconhecido';

      if (errorMessage.includes('formato incorreto')) {
        showToast('Erro na importação: Os dados estão no formato incorreto');
      } else if (errorMessage.includes('Células vazias')) {
        showToast('Erro na importação: Células vazias detectadas no documento');
      } else {
        showToast(errorMessage);
      }
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <>
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

        <div className="sidebar-footer">
          <button
            onClick={handleImportClick}
            className={`nav-item import-btn ${isCollapsed ? 'centered' : ''}`}
            title={isCollapsed ? 'Importar CSV' : undefined}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              color: 'inherit',
            }}
          >
            <Upload size={20} className="icon" />
            {!isCollapsed && <span className="label">Importar planilha</span>}
          </button>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      </aside>

      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
