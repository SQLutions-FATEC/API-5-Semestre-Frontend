import { render, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Layout from './Layout';

vi.mock('./Sidebar/Sidebar', () => ({
  default: ({ onToggle }: { onToggle: () => void }) => (
    <button data-testid="mock-sidebar-toggle" onClick={onToggle}>
      Toggle
    </button>
  ),
}));

describe('Layout', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders correctly with default expanded state', () => {
    const { container } = render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
    expect(localStorage.getItem('sidebarCollapsed')).toBeNull();
  });

  it('initializes sidebar state from localStorage', () => {
    localStorage.setItem('sidebarCollapsed', 'true');
    const { container } = render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );
    const layoutContent = container.querySelector('.layout-content');
    expect(layoutContent?.className).toContain('collapsed');
  });

  it('toggles sidebar state', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );
    const toggleBtn = getByTestId('mock-sidebar-toggle');

    // Initially null in localStorage
    expect(localStorage.getItem('sidebarCollapsed')).toBeNull();

    act(() => {
      fireEvent.click(toggleBtn);
    });

    // After toggle, it should be set to true
    expect(localStorage.getItem('sidebarCollapsed')).toBe('true');
  });
});
