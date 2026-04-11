import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import OverviewMetrics from './OverviewMetrics';

describe('OverviewMetrics', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <OverviewMetrics />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});
