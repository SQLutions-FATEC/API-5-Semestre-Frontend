import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import NotFoundScreen from './NotFoundScreen';

describe('NotFoundScreen', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <NotFoundScreen />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});
