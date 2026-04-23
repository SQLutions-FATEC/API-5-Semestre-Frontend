import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, FolderKanban } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import ProjectCard from './components/ProjectCard/ProjectCard';
import { projectService } from '../../services/projectService';
import type { ProjectListItem, ProgramOption } from '../../types/project';
import './ProjectListingScreen.scss';

const ProjectListingScreen: React.FC = () => {
  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Carrega programas iniciais
    projectService.getPrograms().then((data) => {
      setPrograms(data);
      if (data.length > 0) setSelectedProgram(data[0].codigo);
    });
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      projectService.getProjectsByProgram(selectedProgram).then(setProjects);
    }
  }, [selectedProgram]);

  const filteredProjects = projects.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              onChange={(e) => setSelectedProgram(e.target.value)}
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
              placeholder="Buscar projeto por nome ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.codigo}
            project={project}
            onClick={(id) => console.log('Navegar para:', id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectListingScreen;
