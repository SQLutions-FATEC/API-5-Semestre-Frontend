import { api } from './api';
import type { ProgramListItem } from '../types/project';

export const programService = {
  async getAllPrograms(q?: string): Promise<ProgramListItem[]> {
    const params = q ? { q } : {};
    const { data } = await api.get('/programas/busca/', { params }); 
    return data.programas.map((p: any) => ({
      codigo: p.codigo_programa,
      nome: p.nome_programa,
      gerente: p.gerente,
      gerente_tecnico: p.gerente_tecnico,
      status: p.status
    }));
  }
};