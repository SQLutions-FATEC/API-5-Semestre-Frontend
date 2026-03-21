import { HelpCircle } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import './HelpScreen.scss';

export default function HelpScreen() {
  return (
    <div className="help-page">
      <PageHeader
        icon={<HelpCircle size={28} />}
        title="Ajuda"
        subtitle="Central de ajuda e perguntas frequentes."
      />

      <div className="help-content">
        <p>Conteúdo da página Ajuda.</p>
      </div>
    </div>
  );
}
