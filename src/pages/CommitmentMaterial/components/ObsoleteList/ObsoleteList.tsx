import type { Material } from '../../../../types/commitment';

type Props = {
  dados: Material[];
};

export default function ObsoleteList({ dados }: Props) {
  return (
    <div className="card">
      <h2>Materiais Obsoletos</h2>

      {dados.length === 0 ? (
        <p>Nenhum material obsoleto</p>
      ) : (
        dados.map(item => (
          <p key={item.id} className="obsolete-text">
            ⚠️ {item.nome}
          </p>
        ))
      )}
    </div>
  );
}