import { api } from './api';
import type { ProgramListItem } from '../types/project';

export const programService = {
  async getAllPrograms(): Promise<ProgramListItem[]> {
    const { data } = await api.get('/programas/detalhes/'); 
    return data;
  }
};