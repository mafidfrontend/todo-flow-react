import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { TodoFilters } from '../TodoFilters';

const defaultProps = {
  currentFilter: 'all' as const,
  onFilterChange: vi.fn(),
  activeTodosCount: 3,
  completedTodosCount: 2,
  onClearCompleted: vi.fn(),
};

describe('TodoFilters', () => {
  beforeEach(() => {
    defaultProps.onFilterChange.mockClear();
    defaultProps.onClearCompleted.mockClear();
  });

  it('renders all filter buttons', () => {
    render(<TodoFilters {...defaultProps} />);
    
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('shows correct counts for each filter', () => {
    render(<TodoFilters {...defaultProps} />);
    
    expect(screen.getByText('5')).toBeInTheDocument(); // All: 3 + 2
    expect(screen.getByText('3')).toBeInTheDocument(); // Active
    expect(screen.getByText('2')).toBeInTheDocument(); // Completed
  });

  it('calls onFilterChange when filter button is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoFilters {...defaultProps} />);
    
    const activeButton = screen.getByText('Active').closest('button');
    if (activeButton) {
      await user.click(activeButton);
      expect(defaultProps.onFilterChange).toHaveBeenCalledWith('active');
    }
  });

  it('shows remaining tasks count', () => {
    render(<TodoFilters {...defaultProps} />);
    
    expect(screen.getByText('3 tasks remaining')).toBeInTheDocument();
  });

  it('shows clear completed button when there are completed todos', () => {
    render(<TodoFilters {...defaultProps} />);
    
    expect(screen.getByText('Clear Completed (2)')).toBeInTheDocument();
  });

  it('calls onClearCompleted when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoFilters {...defaultProps} />);
    
    const clearButton = screen.getByText('Clear Completed (2)');
    await user.click(clearButton);
    
    expect(defaultProps.onClearCompleted).toHaveBeenCalled();
  });
});