import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import StepSwitcher from './StepSwitcher';

describe('StepSwitcher', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <StepSwitcher
          options={['Step 1', 'Step 2']}
          activeOption={'Step 1'}
          onOptionChange={vi.fn()}
        />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});
