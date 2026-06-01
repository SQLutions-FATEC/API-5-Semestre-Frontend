import React, { useState, useEffect } from 'react';
import { Search, LayoutGrid } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import ProgramCard from './components/ProgramCard/ProgramCard';
import { programService } from '../../services/programService';
import type { ProgramListItem } from '../../types/project';
import './ProgramListingScreen.scss';

const ProgramListingScreen: React.FC = () => {
  const [programs, setPrograms] = useState<ProgramListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPrograms = (query?: string) => {
    setIsLoading(true);
    setError(null);
    programService
      .getAllPrograms(query)
      .then(setPrograms)
      .catch((err) => {
        console.error(err);
        setError('Ocorreu um erro ao carregar os programas. Tente novamente mais tarde.');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchPrograms(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    fetchPrograms('');
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="no-results-container">
          <h3>Erro</h3>
          <p>{error}</p>
          <button className="clear-filter-button" onClick={handleClear}>
            Tentar novamente
          </button>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="no-results-container">
          <p>Carregando...</p>
        </div>
      );
    }

    if (programs.length > 0) {
      return (
        <div className="programs-grid">
          {programs.map((prog) => (
            <ProgramCard key={prog.codigo} program={prog} />
          ))}
        </div>
      );
    }

    return (
      <div className="no-results-container">
        <Search size={48} className="no-results-icon" />
        <h3>Nenhum programa encontrado</h3>
        <p>
          Não encontramos resultados para &quot;<strong>{searchTerm}</strong>&quot;. Verifique a
          ortografia ou tente outro termo.
        </p>
        <button className="clear-filter-button" onClick={handleClear}>
          Limpar busca
        </button>
      </div>
    );
  };

  return (
    <div className="program-listing-container">
      <div className="listing-controls">
        <PageHeader
          icon={<LayoutGrid />}
          title="Programas"
          subtitle="Visualize e gerencie os programas da instituição"
        />

        <div className="filter-bar">
          <div className="search-wrapper full-width">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Buscar programa por nome ou código... (Pressione Enter)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default ProgramListingScreen;
