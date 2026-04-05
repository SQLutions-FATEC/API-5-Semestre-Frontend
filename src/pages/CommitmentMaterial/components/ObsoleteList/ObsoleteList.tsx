import type { MaterialObsoleto } from '../../../../services/commitmentService';
import './ObsoleteList.scss';

type Props = {
  data: MaterialObsoleto[];
};

export default function ObsoleteList({ data }: Props) {
  return (
    <div className="commitment-card">
      <div className="card-header">
        <h2>Materiais Obsoletos Críticos</h2>
      </div>
      <div className="obsolete-list-container">
        {data && data.length > 0 ? (
          data.map(item => (
            <div key={item.codigo_material} className="obsolete-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="warning-icon" title="Material Obsoleto">⚠️</span>
                <div className="item-info">
                  <span className="item-name font-bold">{item.descricao}</span>
                  <span className="item-category text-sm text-gray-500">Cód: {item.codigo_material}</span>
                </div>
              </div>

              {/* Badges para dar visibilidade aos alertas críticos que vêm da API */}
              <div className="item-badges flex gap-2">
                {item.vinculado_ao_projeto && (
                  <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>
                    Vinculado
                  </span>
                )}
                {item.pedido_recente && (
                  <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>
                    Pedido Recente
                  </span>
                )}
              </div>

            </div>
          ))
        ) : (
          <p className="empty-msg">Nenhum material obsoleto crítico encontrado.</p>
        )}
      </div>
    </div>
  );
}