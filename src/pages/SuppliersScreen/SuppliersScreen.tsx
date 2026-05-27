import { useEffect, useState } from 'react';
import ProjectLayout from '../../components/ProjectLayout/ProjectLayout';
import { Building2, Package, MapPin, Network, Monitor, ChevronDown } from 'lucide-react';
import SupplierInfoModal from '../Purchases/components/SupplierInfoModal/SupplierInfoModal';
import type { SupplierInfo, SupplierListFilters } from '../../types/purchase';
import { supplierService } from '../../services/supplierService';
import './SuppliersScreen.scss';

const INITIAL_FILTERS: SupplierListFilters = {
  fornecedor_nome: '',
  fornecedor_cidade: '',
  programa_nome: '',
  projeto_nome: '',
  categoria: '',
};

const getStatusColor = (supplier: SupplierInfo): string => {
  const status = supplier.status?.trim().toLowerCase();
  if (status && status !== 'ativo' && status !== 'active') return 'red';
  if (supplier.ativo === false) return 'red';
  return 'green';
};

export default function SuppliersScreen() {
  const [filters, setFilters] = useState<SupplierListFilters>(INITIAL_FILTERS);
  const [suppliers, setSuppliers] = useState<SupplierInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierInfo | null>(null);

  const handleFilterChange = (field: keyof SupplierListFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const loadSuppliers = async (nextFilters: SupplierListFilters = filters) => {
    setError('');
    setIsSubmitting(true);
    try {
      const data = await supplierService.getSuppliers(nextFilters);
      setSuppliers(data);
    } catch {
      setSuppliers([]);
      setError('Não foi possível carregar os fornecedores.');
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadSuppliers(INITIAL_FILTERS);
  }, []);

  const handleApplyFilters = () => {
    void loadSuppliers(filters);
  };

  return (
    <ProjectLayout pageClassName="suppliers-page">
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
                      value={filters.fornecedor_nome}
                      onChange={(e) => handleFilterChange('fornecedor_nome', e.target.value)}
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
                      value={filters.categoria}
                      onChange={(e) => handleFilterChange('categoria', e.target.value)}
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
                      value={filters.fornecedor_cidade}
                      onChange={(e) => handleFilterChange('fornecedor_cidade', e.target.value)}
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
                      value={filters.programa_nome}
                      onChange={(e) => handleFilterChange('programa_nome', e.target.value)}
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
                      value={filters.projeto_nome}
                      onChange={(e) => handleFilterChange('projeto_nome', e.target.value)}
                      className="filter-input"
                    />
                    <ChevronDown size={16} className="select-icon" />
                  </div>
                </div>

                <div className="filter-action">
                  <button
                    type="button"
                    className="apply-filters-btn"
                    onClick={handleApplyFilters}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Aplicando...' : 'Aplicar Filtros'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {error && <p>{error}</p>}

          {isLoading ? (
            <p>Carregando fornecedores...</p>
          ) : suppliers.length > 0 ? (
            <section className="suppliers-grid">
              {suppliers.map((supplier, index) => (
                <button
                  key={supplier.codigo_fornecedor}
                  type="button"
                  className="supplier-card"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedSupplier(supplier)}
                  aria-label={`Ver detalhes do fornecedor ${supplier.nome_fornecedor}`}
                >
                  <div className={`status-indicator status-${getStatusColor(supplier)}`} />

                  <div className="supplier-card-header">
                    <div className="supplier-label">
                      <Building2 size={12} />
                      <span>Nome do fornecedor</span>
                    </div>
                    <h3 className="supplier-name">{supplier.nome_fornecedor}</h3>
                  </div>

                  <div className="supplier-card-body">
                    <div className="info-row">
                      <div className="info-label">
                        <Package size={12} />
                        <span>Categoria</span>
                      </div>
                      <p className="info-value">{supplier.categoria}</p>
                    </div>

                    <div className="info-row">
                      <div className="info-label">
                        <MapPin size={12} />
                        <span>Cidade</span>
                      </div>
                      <p className="info-value">{supplier.cidade}</p>
                    </div>
                  </div>
                </button>
              ))}
            </section>
          ) : (
            <p>Nenhum fornecedor encontrado.</p>
          )}

          {selectedSupplier && (
            <SupplierInfoModal
              supplier={selectedSupplier}
              onClose={() => setSelectedSupplier(null)}
            />
          )}
        </div>
      )}
    </ProjectLayout>
  );
}
