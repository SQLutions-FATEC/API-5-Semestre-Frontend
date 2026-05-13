import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import PurchasesTabs from './PurchasesTabs';

describe('PurchasesTabs', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <PurchasesTabs />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});
