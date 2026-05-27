import React, { useState, useMemo } from 'react';
import { X, AlertTriangle, Check, MapPin, Tag, Search, ChevronDown } from 'lucide-react';
import type { SupplierInfo, SupplierPreviousOrder } from '../../../../types/purchase';
import './SupplierInfoModal.scss';

// --- Helpers ---

type ReliabilityStatus = 'ok' | 'warning' | 'danger';

const getReliabilityStatus = (supplier: SupplierInfo): ReliabilityStatus => {
  if (supplier.ativo === false) return 'danger';
  if (supplier.status && supplier.status.toLowerCase() !== 'ativo') return 'danger';
  if (typeof supplier.total_pedidos !== 'number' || typeof supplier.total_atrasos !== 'number') {
    return 'ok';
  }
  if (supplier.total_pedidos === 0) return 'ok';
  const delayRate = supplier.total_atrasos / supplier.total_pedidos;
  if (delayRate >= 0.4) return 'danger';
  if (delayRate >= 0.2) return 'warning';
  return 'ok';
};

const ReliabilityIcon: React.FC<{ status: ReliabilityStatus }> = ({ status }) => {
  if (status === 'ok') {
    return (
      <span
        className="supplier-modal__reliability supplier-modal__reliability--ok"
        aria-label="Fornecedor confiável"
      >
        <Check size={20} strokeWidth={2.5} />
      </span>
    );
  }
  if (status === 'warning') {
    return (
      <span
        className="supplier-modal__reliability supplier-modal__reliability--warning"
        aria-label="Fornecedor com atrasos moderados"
      >
        <AlertTriangle size={20} strokeWidth={2.5} />
      </span>
    );
  }
  return (
    <span
      className="supplier-modal__reliability supplier-modal__reliability--danger"
      aria-label="Fornecedor com alta taxa de atraso"
    >
      <AlertTriangle size={20} strokeWidth={2.5} />
    </span>
  );
};

// --- Props ---

interface SupplierInfoModalProps {
  supplier: SupplierInfo;
  onClose: () => void;
}

// --- Component ---

const SupplierInfoModal: React.FC<SupplierInfoModalProps> = ({ supplier, onClose }) => {
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('');

  const reliability = getReliabilityStatus(supplier);

  const projectOptions = useMemo(() => {
    const codes = (supplier.pedidos_anteriores ?? []).map((p) => p.codigo_projeto);
    return Array.from(new Set(codes));
  }, [supplier.pedidos_anteriores]);

  const filteredOrders = useMemo<SupplierPreviousOrder[]>(() => {
    return (supplier.pedidos_anteriores ?? []).filter((order) => {
      const matchesSearch =
        search === '' ||
        order.codigo_projeto.toLowerCase().includes(search.toLowerCase()) ||
        order.codigo_pedido.toLowerCase().includes(search.toLowerCase()) ||
        order.nome_material.toLowerCase().includes(search.toLowerCase());
      const matchesProject = projectFilter === '' || order.codigo_projeto === projectFilter;
      return matchesSearch && matchesProject;
    });
  }, [supplier.pedidos_anteriores, search, projectFilter]);

  // Fix: backdrop uses presentation role + keyboard handler; dialog element handles accessibility
  const handleBackdropKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="supplier-modal__backdrop"
      onClick={handleBackdropClick}
      onKeyDown={handleBackdropKeyDown}
    >
      {/* Fix: <dialog> instead of role="dialog" for proper accessibility */}
      <dialog
        open
        className="supplier-modal__outer"
        aria-label={`Informações do fornecedor ${supplier.nome_fornecedor}`}
      >
        {/* Container branco */}
        <div className="supplier-modal__container">
          {/* Header */}
          <div className="supplier-modal__header">
            <span className="supplier-modal__label">Nome do fornecedor</span>
            <div className="supplier-modal__title-row">
              <h2 className="supplier-modal__name">{supplier.nome_fornecedor}</h2>
              <span className="supplier-modal__code">{supplier.codigo_fornecedor}</span>
              <span
                className={`supplier-modal__status-dot ${
                  (supplier.ativo ?? supplier.status?.toLowerCase() === 'ativo')
                    ? 'supplier-modal__status-dot--active'
                    : 'supplier-modal__status-dot--inactive'
                }`}
                title={supplier.status ?? (supplier.ativo ? 'Ativo' : 'Inativo')}
                aria-label={
                  supplier.status ?? (supplier.ativo ? 'Fornecedor ativo' : 'Fornecedor inativo')
                }
              />
              {supplier.status && <span className="supplier-modal__code">{supplier.status}</span>}
            </div>
          </div>

          {/* Info Row */}
          <div className="supplier-modal__info-row">
            <div className="supplier-modal__info-block">
              <span className="supplier-modal__label">
                <Tag size={12} /> Categoria
              </span>
              <span className="supplier-modal__category-badge">{supplier.categoria}</span>
            </div>

            <div className="supplier-modal__info-block supplier-modal__info-block--location">
              <span className="supplier-modal__label">
                <MapPin size={12} /> Cidade
              </span>
              <span className="supplier-modal__location">
                {supplier.cidade}
                {supplier.regiao && (
                  <>
                    <span className="supplier-modal__separator">–</span>
                    <span className="supplier-modal__label supplier-modal__label--inline">
                      Região
                    </span>
                    {supplier.regiao}
                  </>
                )}
              </span>
            </div>

            {typeof supplier.total_pedidos === 'number' &&
              typeof supplier.total_atrasos === 'number' && (
                <>
                  <div className="supplier-modal__stat-card supplier-modal__stat-card--neutral">
                    <span className="supplier-modal__stat-label">Pedidos deste fornecedor</span>
                    <span className="supplier-modal__stat-value">{supplier.total_pedidos}</span>
                  </div>

                  <div className="supplier-modal__stat-card supplier-modal__stat-card--danger">
                    <span className="supplier-modal__stat-label">Atrasos por este fornecedor</span>
                    <span className="supplier-modal__stat-value supplier-modal__stat-value--danger">
                      {supplier.total_atrasos}
                    </span>
                  </div>
                </>
              )}
          </div>

          {/* Previous Orders */}
          <div className="supplier-modal__orders-section">
            <div className="supplier-modal__orders-header">
              <h3 className="supplier-modal__orders-title">
                {/* Fix: emoji moved to CSS ::before to avoid ambiguous spacing warning */}
                Pedidos anteriores
              </h3>

              <div className="supplier-modal__filters">
                <span className="supplier-modal__filter-label">Filtrar por projeto</span>
                <div className="supplier-modal__select-wrapper">
                  <select
                    className="supplier-modal__select"
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value)}
                    aria-label="Filtrar por projeto"
                  >
                    <option value="">Pesquisar programa...</option>
                    {projectOptions.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="supplier-modal__select-chevron" />
                </div>

                <div className="supplier-modal__search-wrapper">
                  <Search size={14} className="supplier-modal__search-icon" />
                  <input
                    type="text"
                    className="supplier-modal__search"
                    placeholder="Buscar pedido ou material..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Buscar pedidos anteriores"
                  />
                </div>
              </div>
            </div>

            <div className="supplier-modal__table-wrapper">
              <table className="supplier-modal__table">
                <thead>
                  <tr>
                    <th>codigo_projeto</th>
                    <th>Codigo do pedido</th>
                    <th>Nome do material</th>
                    <th>Valor Gasto</th>
                    <th>Data pedida</th>
                    <th>Data_previsao</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                      <tr key={`${order.codigo_pedido}-${index}`}>
                        <td>{order.codigo_projeto}</td>
                        <td>{order.codigo_pedido}</td>
                        <td>{order.nome_material}</td>
                        <td>
                          {order.valor_gasto.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </td>
                        <td>{order.data_pedida}</td>
                        <td>{order.data_previsao}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="supplier-modal__empty">
                        Nenhum pedido encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Ações externas: ícone de confiabilidade + fechar */}
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
