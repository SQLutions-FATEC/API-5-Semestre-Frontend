import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, FolderKanban } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import ProjectCard from './components/ProjectCard/ProjectCard';
import { projectService } from '../../services/projectService';
import type { ProjectListItem, ProgramOption } from '../../types/project';
import './ProjectListingScreen.scss';

const ProjectListingScreen: React.FC = () => {
  const { programa_cod } = useParams<{ programa_cod: string }>();
  const navigate = useNavigate();

  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>(programa_cod || '');
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    projectService.getPrograms().then((data) => {
      setPrograms(data);
      if (data.length > 0 && !programa_cod) {
        navigate(`/programas/${data[0].codigo}/projetos`, { replace: true });
      }
    });
  }, [programa_cod, navigate]);

  useEffect(() => {
    if (programa_cod) {
      setSelectedProgram(programa_cod);
      fetchProjects(programa_cod, '');
    }
  }, [programa_cod]);

  const fetchProjects = (programId: string, query: string) => {
    setIsLoading(true);
    setError(null);
    projectService.getProjectsByProgram(programId, query)
      .then(setProjects)
      .catch((err) => {
        console.error(err);
        setError('Ocorreu um erro ao carregar os projetos. Tente novamente mais tarde.');
      })
      .finally(() => setIsLoading(false));
  };

  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCod = e.target.value;
    navigate(`/programas/${newCod}/projetos`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && selectedProgram) {
      fetchProjects(selectedProgram, searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (selectedProgram) fetchProjects(selectedProgram, '');
  };

  return (
    <div className="project-listing-container">
      <div className="listing-controls">
        <PageHeader
          icon={<FolderKanban />}
          title="Meus Projetos"
          subtitle="Selecione um programa e gerencie seus projetos"
        />

        <div className="filter-bar">
          <div className="dropdown-wrapper">
            <select
              value={selectedProgram}
              onChange={handleProgramChange}
              className="program-select"
            >
              {programs.map((prog) => (
                <option key={prog.codigo} value={prog.codigo}>
                  {prog.nome}
                </option>
              ))}
            </select>
            <ChevronDown className="dropdown-icon" size={18} />
          </div>

          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Buscar projeto por nome ou código... (Pressione Enter)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      </div>

      {error ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>Erro</h3>
          <p>{error}</p>
          <button className="clear-filter-button" onClick={handleClear}>Tentar novamente</button>
        </div>
      ) : isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Carregando projetos...</p>
        </div>
      ) : projects.length > 0 ? (
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.codigo}
              project={project}
              onClick={(id) => navigate(`/programas/${selectedProgram}/projetos/${id}`)}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Search size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
          <h3>Nenhum projeto encontrado</h3>
          <p>
            Não encontramos resultados para a busca. Verifique a ortografia ou limpe os filtros.
          </p>
          <button className="clear-filter-button" onClick={handleClear} style={{ marginTop: '16px' }}>Limpar busca</button>
        </div>
      )}
    </div>
  );
};

export default ProjectListingScreen;
