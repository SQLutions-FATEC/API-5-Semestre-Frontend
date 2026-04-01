import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HoursTracking, { tooltipFormatter } from './HoursTracking';

describe('HoursTracking Component', () => {
  it('should render the component header correctly', () => {
    render(<HoursTracking />);

    // Verifies if the main title is present
    expect(screen.getByText('Acompanhamento de horas')).toBeInTheDocument();
  });

  it('should render table data correctly (coverage for table map)', () => {
    render(<HoursTracking />);

    // Verifies if row data is rendered, covering the table row map function
    expect(screen.getByText('TSK001')).toBeInTheDocument();
    expect(screen.getByText('Prototipação da placa')).toBeInTheDocument();
    expect(screen.getByText('Roteamento multicamada')).toBeInTheDocument();
  });

  it('should render pie chart details correctly (coverage for pie legend map)', () => {
    render(<HoursTracking />);

    // Verifies if the text and users mapped by legend are present
    expect(screen.getByText(/35,8% Felipe Rocha/i)).toBeInTheDocument();
    expect(screen.getByText(/64,2% Carla souza/i)).toBeInTheDocument();
  });

  it('should format tooltip tooltip correctly (coverage for formatter)', () => {
    // Call the formatter directly
    const result = tooltipFormatter(10);
    expect(result).toEqual(['10h', 'Horas']);
  });
});
