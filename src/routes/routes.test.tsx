import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import routes from './routes';

describe('routes', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <routes />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});
