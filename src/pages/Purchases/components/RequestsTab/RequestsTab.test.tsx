import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import RequestsTab from './RequestsTab';

describe('RequestsTab', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <RequestsTab />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});
