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

  useEffect(() => {
    programService.getAllPrograms().then(setPrograms);
  }, []);

  const filteredPrograms = programs.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              placeholder="Buscar programa por nome ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredPrograms.length > 0 ? (
        <div className="programs-grid">
          {filteredPrograms.map((prog) => (
            <ProgramCard key={prog.codigo} program={prog} />
          ))}
        </div>
      ) : (
        <div className="no-results-container">
          <Search size={48} className="no-results-icon" />
          <h3>Nenhum programa encontrado</h3>
          <p>
            Não encontramos resultados para "<strong>{searchTerm}</strong>". 
            Verifique a ortografia ou tente outro termo.
          </p>
          <button 
            className="clear-filter-button" 
            onClick={() => setSearchTerm('')}
          >
            Limpar busca
          </button>
        </div>
      )}
    </div>
  );
};

export default ProgramListingScreen;