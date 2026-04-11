import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import PurchasesScreen from './PurchasesScreen';

describe('PurchasesScreen', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <PurchasesScreen />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});
