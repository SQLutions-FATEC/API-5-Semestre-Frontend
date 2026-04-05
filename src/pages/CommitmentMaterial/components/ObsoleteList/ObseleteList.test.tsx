import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { MaterialObsoleto } from '../../../../services/commitmentService';
import ObsoleteList from './ObsoleteList';

// 1. Mock atualizado com a estrutura idêntica à que vem da API
const mockObsoletos: MaterialObsoleto[] = [
  {
    codigo_material: 'MAT001',
    descricao: 'Sensor ACS712',
    status: 'Obsoleto',
    vinculado_ao_projeto: true,   // Deve mostrar a badge "Vinculado"
    pedido_recente: false
  },
  {
    codigo_material: 'MAT002',
    descricao: 'Relé 12V 5A',
    status: 'Obsoleto',
    vinculado_ao_projeto: false,
    pedido_recente: true          // Deve mostrar a badge "Pedido Recente"
  }
];

describe('ObsoleteList Component', () => {
  it('deve renderizar a lista de materiais obsoletos corretamente com seus códigos', () => {
    render(<ObsoleteList data={mockObsoletos} />);

    // Verifica se renderizou a descrição
    expect(screen.getByText('Sensor ACS712')).toBeDefined();

    // Verifica se renderizou o código formatado
    expect(screen.getByText('Cód: MAT001')).toBeDefined();

    // Verifica se renderizou o ícone de aviso
    expect(screen.getAllByText('⚠️').length).toBeGreaterThan(0);
  });

  it('deve renderizar as badges de alerta baseadas nas flags da API', () => {
    render(<ObsoleteList data={mockObsoletos} />);

    // Como o MAT001 tem vinculado_ao_projeto = true, a badge deve aparecer
    expect(screen.getByText('Vinculado')).toBeDefined();

    // Como o MAT002 tem pedido_recente = true, a badge deve aparecer
    expect(screen.getByText('Pedido Recente')).toBeDefined();
  });

  it('deve exibir mensagem de lista vazia quando não houver dados', () => {
    render(<ObsoleteList data={[]} />);

    // O texto foi atualizado no componente para ser mais específico
    expect(screen.getByText('Nenhum material obsoleto crítico encontrado.')).toBeDefined();
  });
});