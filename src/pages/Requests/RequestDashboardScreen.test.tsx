import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import RequestDashboardScreen from './RequestDashboardScreen';

describe('RequestDashboardScreen', () => {
  it('renders the screen shell and child components correctly', () => {
    render(<RequestDashboardScreen />);

    expect(screen.getByText('Dashboard de Solicitações')).toBeInTheDocument();
    expect(screen.getByText('Acompanhamento e rastreio de materiais')).toBeInTheDocument();

    expect(screen.getByText('Convertidas em Pedido')).toBeInTheDocument();
    expect(screen.getByText('Todas as Solicitações')).toBeInTheDocument();
  });
});
