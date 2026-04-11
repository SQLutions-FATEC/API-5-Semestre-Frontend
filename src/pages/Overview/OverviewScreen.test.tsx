import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import OverviewScreen from './OverviewScreen';

describe('OverviewScreen', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <OverviewScreen />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});
