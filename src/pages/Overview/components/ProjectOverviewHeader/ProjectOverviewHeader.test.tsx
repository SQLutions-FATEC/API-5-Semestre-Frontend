import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ProjectOverviewHeader from './ProjectOverviewHeader';

describe('ProjectOverviewHeader', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <ProjectOverviewHeader />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});
