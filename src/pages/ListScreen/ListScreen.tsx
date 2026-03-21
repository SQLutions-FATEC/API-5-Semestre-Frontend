import { ListOrdered } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import './ListScreen.scss';

export default function ListScreen() {
  return (
    <div className="lists-page">
      <PageHeader
        icon={<ListOrdered size={28} />}
        title="Compras"
        subtitle="Acompanhamento dos pedidos de compras consolidados."
      />

      <div className="lists-content">
        <p>Conteúdo da página Compras</p>
      </div>
    </div>
  );
}
