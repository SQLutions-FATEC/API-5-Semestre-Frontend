import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import PageHeader from './PageHeader';

describe('PageHeader', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <PageHeader />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});
