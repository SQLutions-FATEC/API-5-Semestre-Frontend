import { Database } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import './DataScreen.scss';

export default function DataScreen() {
  return (
    <div className="data-page">
      <PageHeader
        icon={<Database size={28} />}
        title="Base de Dados"
        subtitle="Navegação e exploração de dados do sistema."
      />

      <div className="data-content">
        <p>Conteúdo da página Base de Dados.</p>
      </div>
    </div>
  );
}
