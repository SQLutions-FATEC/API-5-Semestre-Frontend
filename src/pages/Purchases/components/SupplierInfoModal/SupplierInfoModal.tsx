import { AlertTriangle, Check, MapPin, Search, Tag, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { supplierService } from '../../../../services/supplierService';
import type {
  SupplierDetail,
  SupplierOrder,
  SupplierOrdersResponse
} from '../../../../types/purchase';
import './SupplierInfoModal.scss';

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────

type ReliabilityStatus = 'ok' | 'warning' | 'danger';

const getReliabilityStatus = (totalOrders: number, totalDelays: number): ReliabilityStatus => {
  if (totalOrders === 0) return 'ok';

  const successRate = (totalOrders - totalDelays) / totalOrders;

  if (successRate >= 0.75) return 'ok';       // >= 75%
  if (successRate >= 0.50) return 'warning';  // >= 50% e <= 74.9%
  return 'danger';                            // < 50%
};

const ReliabilityIcon: React.FC<{ status: ReliabilityStatus }> = ({ status }) => {
  if (status === 'ok') {
    return (
      <span className="supplier-modal__reliability supplier-modal__reliability--ok" aria-label="Confiável">
        <Check size={20} strokeWidth={2.5} />
      </span>
    );
  }
  if (status === 'warning') {
    return (
      <span className="supplier-modal__reliability supplier-modal__reliability--warning" aria-label="Atenção">
        <AlertTriangle size={20} strokeWidth={2.5} />
      </span>
    );
  }
  return (
    <span className="supplier-modal__reliability supplier-modal__reliability--danger" aria-label="Crítico">
      <X size={20} strokeWidth={2.5} />
    </span>
  );
};

// Mapeia o texto do backend para as classes do seu SCSS
const getStatusClass = (status: string | undefined) => {
  if (!status) return 'supplier-modal__status-dot--inactive';

  const statusLower = status.toLowerCase();
  if (statusLower === 'ativo') return 'supplier-modal__status-dot--active'; // Verde
  if (statusLower === 'bloqueado') return 'supplier-modal__status-dot--blocked'; // Vermelho
  return 'supplier-modal__status-dot--inactive'; // Amarelo/Inativo
};

// ─────────────────────────────────────────
// Props do Componente
// ─────────────────────────────────────────

interface SupplierInfoModalProps {
  supplierId: string | number;
  onClose: () => void;
}

// ─────────────────────────────────────────
// Componente
// ─────────────────────────────────────────

const SupplierInfoModal: React.FC<SupplierInfoModalProps> = ({ supplierId, onClose }) => {
  const [fornecedorInfo, setFornecedorInfo] = useState<SupplierDetail | null>(null);
  const [pedidosInfo, setPedidosInfo] = useState<SupplierOrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [localSearch, setLocalSearch] = useState('');
  const [projectInput, setProjectInput] = useState('');
  const [debouncedProject, setDebouncedProject] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedProject(projectInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [projectInput]);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      supplierService.getSupplierDetail(supplierId),
      supplierService.getSupplierOrders(supplierId, debouncedProject)
    ])
      .then(([dadosFornecedor, dadosPedidos]) => {
        setFornecedorInfo(dadosFornecedor);
        setPedidosInfo(dadosPedidos);
      })
      .catch(err => console.error("Erro ao buscar dados do modal:", err))
      .finally(() => setLoading(false));

  }, [supplierId, debouncedProject]);

  const filteredOrders = useMemo<SupplierOrder[]>(() => {
    if (!pedidosInfo?.pedidos) return [];

    return pedidosInfo.pedidos.filter((order) => {
      const term = localSearch.toLowerCase();
      return (
        term === '' ||
        order.codigo_do_pedido.toLowerCase().includes(term) ||
        order.nome_do_material.toLowerCase().includes(term)
      );
    });
  }, [pedidosInfo, localSearch]);

  const handleBackdropKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (loading || !fornecedorInfo || !pedidosInfo) {
    return (
      <div className="supplier-modal__backdrop">
        <dialog open className="supplier-modal__outer">
          <div className="supplier-modal__container" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
            <span className="supplier-modal__label">Carregando dados do fornecedor...</span>
          </div>
        </dialog>
      </div>
    );
  }

  const reliability = getReliabilityStatus(
    pedidosInfo.quantidade_pedidos_totais,
    pedidosInfo.quantidade_atrasos
  );

  return (
    <div
      className="supplier-modal__backdrop"
      onClick={handleBackdropClick}
      onKeyDown={handleBackdropKeyDown}
    >
      <dialog
        open
        className="supplier-modal__outer"
        aria-label={`Informações do fornecedor ${pedidosInfo.fornecedor}`}
      >
        <div className="supplier-modal__container">

          {/* Header */}
          <div className="supplier-modal__header">
            <span className="supplier-modal__label">Nome do fornecedor</span>
            <div className="supplier-modal__title-row">
              <h2 className="supplier-modal__name">{pedidosInfo.fornecedor}</h2>
              <span className="supplier-modal__code">{fornecedorInfo.codigo_fornecedor}</span>
              <span
                className={`supplier-modal__status-dot ${getStatusClass(fornecedorInfo.status)}`}
                title={`Status: ${fornecedorInfo.status}`}
                aria-label={`Status do fornecedor: ${fornecedorInfo.status}`}
              />
              {fornecedorInfo.status && <span className="supplier-modal__code">{fornecedorInfo.status}</span>}
            </div>
          </div>

          {/* Info Row */}
          <div className="supplier-modal__info-row">
            <div className="supplier-modal__info-block">
              <span className="supplier-modal__label">
                <Tag size={12} /> Categoria
              </span>
              <span className="supplier-modal__category-badge">{fornecedorInfo.categoria}</span>
            </div>

            <div className="supplier-modal__info-block supplier-modal__info-block--location">
              <span className="supplier-modal__label">
                <MapPin size={12} /> Cidade
              </span>
              <span className="supplier-modal__location">
                {fornecedorInfo.cidade}
                <span className="supplier-modal__separator">–</span>
                <span className="supplier-modal__label supplier-modal__label--inline">Estado</span>
                {' '}{fornecedorInfo.estado}
              </span>
            </div>

            <div className="supplier-modal__stat-card supplier-modal__stat-card--neutral">
              <span className="supplier-modal__stat-label">Pedidos deste fornecedor</span>
              <span className="supplier-modal__stat-value">{pedidosInfo.quantidade_pedidos_totais}</span>
            </div>

            <div className="supplier-modal__stat-card supplier-modal__stat-card--danger">
              <span className="supplier-modal__stat-label">Atrasos por este fornecedor</span>
              <span className="supplier-modal__stat-value supplier-modal__stat-value--danger">
                {pedidosInfo.quantidade_atrasos}
              </span>
            </div>
          </div>

          {/* Orders Section */}
          <div className="supplier-modal__orders-section">
            <div className="supplier-modal__orders-header">
              <h3 className="supplier-modal__orders-title">Pedidos anteriores</h3>

              <div className="supplier-modal__filters">
                {/* Filtro via API (Projeto) */}
                <span className="supplier-modal__filter-label">Buscar Projeto</span>
                <div className="supplier-modal__search-wrapper" style={{ marginRight: '8px' }}>
                  <Search size={14} className="supplier-modal__search-icon" />
                  <input
                    type="text"
                    className="supplier-modal__search"
                    placeholder="Ex: PRJ-001..."
                    value={projectInput}
                    onChange={(e) => setProjectInput(e.target.value)}
                    aria-label="Buscar projeto na API"
                  />
                </div>

                {/* Filtro Local (Pedido/Material) */}
                <div className="supplier-modal__search-wrapper">
                  <Search size={14} className="supplier-modal__search-icon" />
                  <input
                    type="text"
                    className="supplier-modal__search"
                    placeholder="Buscar pedido ou material..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    aria-label="Filtrar pedidos listados"
                  />
                </div>
              </div>
            </div>

            <div className="supplier-modal__table-wrapper">
              <table className="supplier-modal__table">
                <thead>
                  <tr>
                    <th>Projeto</th>
                    <th>Pedido</th>
                    <th>Material</th>
                    <th>Valor Gasto</th>
                    <th>Data Pedido</th>
                    <th>Previsão</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                      <tr key={`${order.codigo_do_pedido}-${index}`}>
                        <td>{order.codigo_projeto}</td>
                        <td>{order.codigo_do_pedido}</td>
                        <td>{order.nome_do_material}</td>
                        <td>
                          {order.valor_gasto.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </td>
                        <td>
                          {order.data_pedida
                            ? new Date(order.data_pedida).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                            : '-'}
                        </td>
                        <td style={{
                          color: order.is_atrasado ? '#c53030' : 'inherit',
                          fontWeight: order.is_atrasado ? '600' : 'normal'
                        }}>
                          {order.data_previsao
                            ? new Date(order.data_previsao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                            : '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="supplier-modal__empty">
                        Nenhum pedido encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Ações Externas */}
        <div className="supplier-modal__external-actions">
          <ReliabilityIcon status={reliability} />
          <button className="supplier-modal__close-btn" onClick={onClose} aria-label="Fechar modal">
            <X size={16} />
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default SupplierInfoModal;