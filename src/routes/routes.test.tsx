import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from './routes';

describe('routes', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});
