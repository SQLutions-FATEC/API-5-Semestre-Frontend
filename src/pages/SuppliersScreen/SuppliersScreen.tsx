import { useState } from 'react';
import ProjectLayout from '../../components/ProjectLayout/ProjectLayout';
import { Building2, Package, MapPin, Network, Monitor, ChevronDown } from 'lucide-react';
import SupplierInfoModal from '../Purchases/components/SupplierInfoModal/SupplierInfoModal';
import type { SupplierInfo } from '../../types/purchase';
import './SuppliersScreen.scss';

// MOCK DATA for suppliers
const MOCK_SUPPLIERS: SupplierInfo[] = [
  {
    codigo_fornecedor: 'FOR001',
    nome_fornecedor: 'RTech Distribuidora 1 Ltda',
    categoria: 'Materiais de Solda',
    cidade: 'Jundiaí',
    regiao: 'SP',
    ativo: true,
    total_pedidos: 5,
    total_atrasos: 1,
    pedidos_anteriores: [
      {
        codigo_projeto: 'PRJ001',
        codigo_pedido: 'PC0001',
        nome_material: 'Capacitor Cerâmico 10uF 0603',
        valor_gasto: 16532.28,
        data_pedida: '2024-11-12',
        data_previsao: '2024-12-21',
      },
      {
        codigo_projeto: 'PRJ002',
        codigo_pedido: 'PC0002',
        nome_material: 'Capacitor Cerâmico 10uF 0604',
        valor_gasto: 2687.16,
        data_pedida: '2022-08-24',
        data_previsao: '2022-09-19',
      },
      {
        codigo_projeto: 'PRJ003',
        codigo_pedido: 'PC0003',
        nome_material: 'Capacitor Cerâmico 1nF 0402',
        valor_gasto: 278.64,
        data_pedida: '2022-04-14',
        data_previsao: '2022-05-27',
      },
    ],
  },
  {
    codigo_fornecedor: 'FOR002',
    nome_fornecedor: 'RTech Distribuidora 1 Ltda',
    categoria: 'Materiais de Solda',
    cidade: 'Jundiaí',
    regiao: 'SP',
    ativo: true,
    total_pedidos: 10,
    total_atrasos: 3,
    pedidos_anteriores: [],
  },
  {
    codigo_fornecedor: 'FOR003',
    nome_fornecedor: 'RTech Distribuidora 1 Ltda',
    categoria: 'Materiais de Solda',
    cidade: 'Jundiaí',
    regiao: 'SP',
    ativo: true,
    total_pedidos: 5,
    total_atrasos: 0,
    pedidos_anteriores: [],
  },
  {
    codigo_fornecedor: 'FOR004',
    nome_fornecedor: 'RTech Distribuidora 1 Ltda',
    categoria: 'Materiais de Solda',
    cidade: 'Jundiaí',
    regiao: 'SP',
    ativo: true,
    total_pedidos: 5,
    total_atrasos: 0,
    pedidos_anteriores: [],
  },
  {
    codigo_fornecedor: 'FOR005',
    nome_fornecedor: 'RTech Distribuidora 1 Ltda',
    categoria: 'Materiais de Solda',
    cidade: 'Jundiaí',
    regiao: 'SP',
    ativo: false,
    total_pedidos: 5,
    total_atrasos: 2,
    pedidos_anteriores: [],
  },
  {
    codigo_fornecedor: 'FOR006',
    nome_fornecedor: 'RTech Distribuidora 1 Ltda',
    categoria: 'Materiais de Solda',
    cidade: 'Jundiaí',
    regiao: 'SP',
    ativo: false,
    total_pedidos: 5,
    total_atrasos: 2,
    pedidos_anteriores: [],
  },
  {
    codigo_fornecedor: 'FOR007',
    nome_fornecedor: 'RTech Distribuidora 1 Ltda',
    categoria: 'Materiais de Solda',
    cidade: 'Jundiaí',
    regiao: 'SP',
    ativo: true,
    total_pedidos: 10,
    total_atrasos: 3,
    pedidos_anteriores: [],
  },
  {
    codigo_fornecedor: 'FOR008',
    nome_fornecedor: 'RTech Distribuidora 1 Ltda',
    categoria: 'Materiais de Solda',
    cidade: 'Jundiaí',
    regiao: 'SP',
    ativo: true,
    total_pedidos: 5,
    total_atrasos: 0,
    pedidos_anteriores: [],
  },
  {
    codigo_fornecedor: 'FOR009',
    nome_fornecedor: 'RTech Distribuidora 1 Ltda',
    categoria: 'Materiais de Solda',
    cidade: 'Jundiaí',
    regiao: 'SP',
    ativo: true,
    total_pedidos: 5,
    total_atrasos: 0,
    pedidos_anteriores: [],
  },
];

//mapeia o status do ativo para a cor da bolinha original
const getStatusColor = (supplier: SupplierInfo): string => {
  if (!supplier.ativo) return 'red';
  const delayRate =
    supplier.total_pedidos === 0 ? 0 : supplier.total_atrasos / supplier.total_pedidos;
  if (delayRate >= 0.4) return 'red';
  if (delayRate >= 0.2) return 'yellow';
  return 'green';
};

export default function SuppliersScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    materialType: '',
    city: '',
    program: '',
    project: '',
  });
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierInfo | null>(null);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
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
                  <button className="apply-filters-btn">Aplicar Filtros</button>
                </div>
              </div>
            </div>
          </section>

          <section className="suppliers-grid">
            {MOCK_SUPPLIERS.map((supplier, index) => (
              <div
                key={supplier.codigo_fornecedor}
                className="supplier-card"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setSelectedSupplier(supplier)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedSupplier(supplier)}
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
              </div>
            ))}
          </section>

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
