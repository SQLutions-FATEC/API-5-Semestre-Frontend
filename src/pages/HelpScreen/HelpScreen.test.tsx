import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HelpScreen from './HelpScreen';

describe('HelpScreen', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <HelpScreen />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});
