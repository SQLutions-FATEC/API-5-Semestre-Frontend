// ObsoleteList.tsx
import type { Material } from '../../../../types/commitment';

export default function ObsoleteList({ dados }: { dados: Material[] }) {
  return (
    <div className="commitment-card h-full"> 
      <div className="card-header">
        <h2 style={{ fontSize: '1rem', color: '#64748b' }}>⚠️ MATERIAIS OBSOLETOS</h2>
      </div>
      <div style={{ marginTop: '15px' }}>
        {dados.map(item => (
          <div key={item.id} style={{ color: '#ef4444', marginBottom: '8px', fontWeight: 500 }}>
             • {item.nome} ({item.categoria})
          </div>
        ))}
      </div>
    </div>
  );
}