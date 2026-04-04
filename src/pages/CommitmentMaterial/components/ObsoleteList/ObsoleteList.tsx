import type { Material } from '../../../../types/commitment';
import './ObsoleteList.scss';

export default function ObsoleteList({ data }: { data: Material[] }) {
  return (
    <div className="commitment-card">
      <div className="card-header">
        <h2>Materiais Obsoletos</h2>
      </div>
      <div className="obsolete-list-container">
        {data.length > 0 ? (
          data.map(item => (
            <div key={item.id} className="obsolete-item">
              <span className="warning-icon">⚠️</span>
              <div className="item-info">
                <span className="item-name">{item.name}</span>
                <span className="item-category">{item.category}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-msg">Nenhum material obsoleto encontrado.</p>
        )}
      </div>
    </div>
  );
}