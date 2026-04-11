import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SectionHeader from './SectionHeader';

describe('SectionHeader', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <SectionHeader />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});
