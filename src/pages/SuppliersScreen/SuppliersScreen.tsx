import { Building2, ChevronDown, MapPin, Monitor, Network, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import ProjectLayout from '../../components/ProjectLayout/ProjectLayout';
import { supplierService } from '../../services/supplierService';
import type { SupplierListItem } from '../../types/purchase';
import SupplierInfoModal from '../Purchases/components/SupplierInfoModal/SupplierInfoModal';
import './SuppliersScreen.scss';

// Tipagem correta para o estado de filtros
interface SupplierListFilters {
  fornecedor_nome: string;
  categoria: string;
  fornecedor_cidade: string;
  programa_nome: string;
  projeto_nome: string;
}

const getStatusColor = (status: string): string => {
  const statusLower = status?.toLowerCase() || '';
  if (statusLower === 'ativo') return 'green';
  if (statusLower === 'bloqueado') return 'red';
  return 'yellow';
};

export default function SuppliersScreen() {
  // Estado de filtros unificado e com as chaves corretas esperadas pela API
  const [filters, setFilters] = useState<SupplierListFilters>({
    fornecedor_nome: '',
    categoria: '',
    fornecedor_cidade: '',
    programa_nome: '',
    projeto_nome: '',
  });

  const [suppliers, setSuppliers] = useState<SupplierListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierListItem | null>(null);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      // Agora passamos o objeto filters inteiro e perfeitamente mapeado
      const data = await supplierService.listSuppliers(filters);
      setSuppliers(data);
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleFilterChange = (field: keyof SupplierListFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    fetchSuppliers();
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
                  <button className="apply-filters-btn" onClick={handleApplyFilters}>
                    Aplicar Filtros
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="suppliers-grid">
            {loading ? (
              <p>Carregando fornecedores...</p>
            ) : suppliers.length > 0 ? (
              suppliers.map((supplier, index) => (
                <button
                  key={supplier.codigo_fornecedor}
                  className="supplier-card"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedSupplier(supplier)}
                  aria-label={`Ver detalhes do fornecedor ${supplier.razao_social}`}
                >
                  <div className={`status-indicator status-${getStatusColor(supplier.status)}`} />

                  <div className="supplier-card-header">
                    <div className="supplier-label">
                      <Building2 size={12} />
                      <span>Nome do fornecedor</span>
                    </div>
                    <h3 className="supplier-name">{supplier.razao_social}</h3>
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
              ))
            ) : (
              <p>Nenhum fornecedor encontrado.</p>
            )}
          </section>

          {selectedSupplier && (
            <SupplierInfoModal
              supplierId={selectedSupplier.codigo_fornecedor}
              onClose={() => setSelectedSupplier(null)}
            />
          )}
        </div>
      )}
    </ProjectLayout>
  );
}
