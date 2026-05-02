import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import StockScreen from './StockScreen';

describe('StockScreen', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <StockScreen />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });

  it('renders the stock page title', () => {
    const { getByText } = render(
      <MemoryRouter>
        <StockScreen />
      </MemoryRouter>
    );
    expect(getByText('Materiais restantes de pedidos anteriores')).toBeTruthy();
  });

  it('renders the total stock value card', () => {
    const { getByText } = render(
      <MemoryRouter>
        <StockScreen valorTotalEstoque="R$ 191.210,00" />
      </MemoryRouter>
    );
    expect(getByText('R$ 191.210,00')).toBeTruthy();
  });

  it('renders the history section', () => {
    const { getByText } = render(
      <MemoryRouter>
        <StockScreen />
      </MemoryRouter>
    );
    expect(getByText('Histórico de empenhos')).toBeTruthy();
  });

  it('shows empty state when there are no alerts', () => {
    const { getByText } = render(
      <MemoryRouter>
        <StockScreen alertas={[]} />
      </MemoryRouter>
    );
    expect(getByText('Nenhum material restante de pedidos anteriores.')).toBeTruthy();
  });

  it('shows empty state when there is no stock', () => {
    const { getByText } = render(
      <MemoryRouter>
        <StockScreen estoque={[]} />
      </MemoryRouter>
    );
    expect(getByText('Nenhum material em estoque.')).toBeTruthy();
  });

  it('shows empty state when there are no open orders', () => {
    const { getByText } = render(
      <MemoryRouter>
        <StockScreen pedidosAbertos={[]} />
      </MemoryRouter>
    );
    
    const pedidosTab = getByText('Pedidos abertos');
    pedidosTab.click();
    
    expect(getByText('Nenhum pedido aberto no momento.')).toBeTruthy();
  });

  it('shows empty state when there is no history', () => {
    const { getByText } = render(
      <MemoryRouter>
        <StockScreen historico={[]} />
      </MemoryRouter>
    );
    expect(getByText('Nenhum empenho encontrado')).toBeTruthy();
    expect(getByText('Os empenhos aparecerão aqui quando forem registrados.')).toBeTruthy();
  });

  it('renders alerts correctly', () => {
    const alertas = [
      { texto: 'Há 300 unidades de Diodo X do projeto Conversor DC-DC Isolado (MAT-D01 | Suspenso) restantes.' },
      { texto: 'Há 150 unidades de Capacitor Cerâmico 10uF do projeto Conversor DC-DC Isolado (MAT-C05 | Concluído) restantes.' },
    ];

    const { getByText } = render(
      <MemoryRouter>
        <StockScreen alertas={alertas} />
      </MemoryRouter>
    );
    
    expect(getByText('Há 300 unidades de Diodo X do projeto Conversor DC-DC Isolado (MAT-D01 | Suspenso) restantes.')).toBeTruthy();
    expect(getByText('Há 150 unidades de Capacitor Cerâmico 10uF do projeto Conversor DC-DC Isolado (MAT-C05 | Concluído) restantes.')).toBeTruthy();
  });

  it('renders stock items correctly', () => {
    const estoque = [
      { nome: 'Capacitor Cerâmico 10uF 0603', qtd: 86, local: 'Laboratório A' },
      { nome: 'Diodo Retificador 1N4007', qtd: 486, local: 'Laboratório C' },
    ];

    const { getByText } = render(
      <MemoryRouter>
        <StockScreen estoque={estoque} />
      </MemoryRouter>
    );

    expect(getByText('Capacitor Cerâmico 10uF 0603')).toBeTruthy();
    expect(getByText('86')).toBeTruthy();
    expect(getByText('Laboratório A')).toBeTruthy();
    expect(getByText('Diodo Retificador 1N4007')).toBeTruthy();
    expect(getByText('486')).toBeTruthy();
    expect(getByText('Laboratório C')).toBeTruthy();
  });

  it('renders history items correctly', () => {
    const historico = [
      { cod: 'MAT001', nome: 'Capacitor Cerâmico 10uF 0603', cat: 'Capacitor', qtd: 171, data: '27/03/2026', status: 'Ativo' },
      { cod: 'MAT002', nome: 'Diodo Retificador 1N4007', cat: 'Diodo', qtd: 42, data: '27/03/2027', status: 'Ativo' },
    ];

    const { getByText, getAllByText } = render(
      <MemoryRouter>
        <StockScreen historico={historico} />
      </MemoryRouter>
    );

    expect(getByText('MAT001')).toBeTruthy();
    expect(getByText('Capacitor Cerâmico 10uF 0603')).toBeTruthy();
    expect(getByText('Capacitor')).toBeTruthy();
    expect(getByText('171')).toBeTruthy();
    expect(getByText('27/03/2026')).toBeTruthy();
    
    const ativoBadges = getAllByText('Ativo');
    expect(ativoBadges).toHaveLength(2);
  });

  it('renders the counter with correct number', () => {
    const { getByText } = render(
      <MemoryRouter>
        <StockScreen totalPedidosEnvolvidos={5} />
      </MemoryRouter>
    );
    
    expect(getByText('5')).toBeTruthy();
  });

  it('renders open orders correctly', () => {
    const pedidosAbertos = [
      { texto: 'O pedido (PD004) está pedindo o material Diodo X que possui sobras de outro pedido (PD002)' },
      { texto: 'O pedido (PD004) está pedindo o material Diodo X que possui sobras de outro pedido (PD009)' },
    ];

    const { getByText } = render(
      <MemoryRouter>
        <StockScreen pedidosAbertos={pedidosAbertos} />
      </MemoryRouter>
    );

    const pedidosTab = getByText('Pedidos abertos');
    pedidosTab.click();

    expect(getByText('O pedido (PD004) está pedindo o material Diodo X que possui sobras de outro pedido (PD002)')).toBeTruthy();
    expect(getByText('O pedido (PD004) está pedindo o material Diodo X que possui sobras de outro pedido (PD009)')).toBeTruthy();
  });

  it('renders chart section', () => {
    const { getByText } = render(
      <MemoryRouter>
        <StockScreen />
      </MemoryRouter>
    );

    expect(getByText('Valor total em estoque')).toBeTruthy();
    expect(getByText('Distribuição de Materiais')).toBeTruthy();
  });
});