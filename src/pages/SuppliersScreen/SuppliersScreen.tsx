import { useState } from 'react';
import ProjectLayout from '../../components/ProjectLayout/ProjectLayout';
import { Building2, Package, MapPin, Network, Monitor, ChevronDown } from 'lucide-react';
import './SuppliersScreen.scss';

// MOCK DATA for suppliers
const MOCK_SUPPLIERS = [
  { id: 1, name: 'RTech Distribuidora 1 Ltda', category: 'Materiais de Solda', city: 'Jundiaí', status: 'green' },
  { id: 2, name: 'RTech Distribuidora 1 Ltda', category: 'Materiais de Solda', city: 'Jundiaí', status: 'yellow' },
  { id: 3, name: 'RTech Distribuidora 1 Ltda', category: 'Materiais de Solda', city: 'Jundiaí', status: 'green' },
  { id: 4, name: 'RTech Distribuidora 1 Ltda', category: 'Materiais de Solda', city: 'Jundiaí', status: 'green' },
  { id: 5, name: 'RTech Distribuidora 1 Ltda', category: 'Materiais de Solda', city: 'Jundiaí', status: 'red' },
  { id: 6, name: 'RTech Distribuidora 1 Ltda', category: 'Materiais de Solda', city: 'Jundiaí', status: 'red' },
  { id: 7, name: 'RTech Distribuidora 1 Ltda', category: 'Materiais de Solda', city: 'Jundiaí', status: 'yellow' },
  { id: 8, name: 'RTech Distribuidora 1 Ltda', category: 'Materiais de Solda', city: 'Jundiaí', status: 'green' },
  { id: 9, name: 'RTech Distribuidora 1 Ltda', category: 'Materiais de Solda', city: 'Jundiaí', status: 'green' },
];

export default function SuppliersScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    materialType: '',
    city: '',
    program: '',
    project: '',
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ProjectLayout pageClassName="suppliers-page" contentClassName="suppliers-content">
      {() => (
        <div className="suppliers-container mt-16">
          <header className="suppliers-header">
            <Building2 size={32} className="header-icon" />
            <h1 className="header-title">Fornecedores</h1>
          </header>

          <section className="filters-section">
            <div className="filters-card">
              <div className="filters-grid">
                <div className="filter-group col-span-2">
                  <label className="filter-label">
                    <Building2 size={14} />
                    <span>Nome do fornecedor</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="Pesquisar fornecedores..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="filter-input text-input"
                    />
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label">
                    <Package size={14} />
                    <span>Tipo de Material</span>
                  </label>
                  <div className="input-wrapper select-wrapper">
                    <input
                      type="text"
                      placeholder="Filtrar por categorias..."
                      value={filters.materialType}
                      onChange={(e) => handleFilterChange('materialType', e.target.value)}
                      className="filter-input"
                    />
                    <ChevronDown size={16} className="select-icon" />
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label">
                    <Building2 size={14} />
                    <span>Cidade</span>
                  </label>
                  <div className="input-wrapper select-wrapper">
                    <input
                      type="text"
                      placeholder="Filtrar por cidades..."
                      value={filters.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      className="filter-input"
                    />
                    <ChevronDown size={16} className="select-icon" />
                  </div>
                </div>

                <div className="divider-vertical"></div>

                <div className="filter-group">
                  <label className="filter-label">
                    <Network size={14} />
                    <span>Programa</span>
                  </label>
                  <div className="input-wrapper select-wrapper">
                    <input
                      type="text"
                      placeholder="Filtrar por programas..."
                      value={filters.program}
                      onChange={(e) => handleFilterChange('program', e.target.value)}
                      className="filter-input"
                    />
                    <ChevronDown size={16} className="select-icon" />
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label">
                    <Monitor size={14} />
                    <span>Projeto</span>
                  </label>
                  <div className="input-wrapper select-wrapper">
                    <input
                      type="text"
                      placeholder="Filtrar por projetos..."
                      value={filters.project}
                      onChange={(e) => handleFilterChange('project', e.target.value)}
                      className="filter-input"
                    />
                    <ChevronDown size={16} className="select-icon" />
                  </div>
                </div>

                <div className="filter-action">
                  <button className="apply-filters-btn">
                    Aplicar Filtros
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="suppliers-grid">
            {MOCK_SUPPLIERS.map((supplier, index) => (
              <div key={supplier.id} className="supplier-card" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className={`status-indicator status-${supplier.status}`} />
                
                <div className="supplier-card-header">
                  <div className="supplier-label">
                    <Building2 size={12} />
                    <span>Nome do fornecedor</span>
                  </div>
                  <h3 className="supplier-name">{supplier.name}</h3>
                </div>

                <div className="supplier-card-body">
                  <div className="info-row">
                    <div className="info-label">
                      <Package size={12} />
                      <span>Categoria</span>
                    </div>
                    <p className="info-value">{supplier.category}</p>
                  </div>
                  
                  <div className="info-row">
                    <div className="info-label">
                      <MapPin size={12} />
                      <span>Cidade</span>
                    </div>
                    <p className="info-value">{supplier.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      )}
    </ProjectLayout>
  );
}
