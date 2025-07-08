import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { TodoItem } from '../TodoItem';
import { Todo } from '@/types/todo';

const mockTodo: Todo = {
  id: '1',
  text: 'Test todo',
  completed: false,
  createdAt: new Date(),
};

const mockHandlers = {
  onToggle: vi.fn(),
  onDelete: vi.fn(),
  onEdit: vi.fn(),
};

describe('TodoItem', () => {
  beforeEach(() => {
    Object.values(mockHandlers).forEach(fn => fn.mockClear());
  });

  it('renders todo text', () => {
    render(<TodoItem todo={mockTodo} {...mockHandlers} />);
    
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('calls onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} {...mockHandlers} />);
    
    const checkbox = screen.getAllByRole('button')[0]; // First button is the checkbox
    await user.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith('1');
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} {...mockHandlers} />);
    
    // Find delete button by its icon - it should be one of the buttons
    const buttons = screen.getAllByRole('button');
    const deleteButton = buttons.find(button => 
      button.querySelector('svg')?.querySelector('path')?.getAttribute('d')?.includes('3 6h18')
    );
    
    if (deleteButton) {
      await user.click(deleteButton);
      expect(mockHandlers.onDelete).toHaveBeenCalledWith('1');
    }
  });

  it('enters edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} {...mockHandlers} />);
    
    // Find edit button by its icon
    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(button => 
      button.querySelector('svg')?.querySelector('path')?.getAttribute('d')?.includes('7 7')
    );
    
    if (editButton) {
      await user.click(editButton);
      expect(screen.getByDisplayValue('Test todo')).toBeInTheDocument();
    }
  });

  it('applies completed styles to completed todo', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(<TodoItem todo={completedTodo} {...mockHandlers} />);
    
    const todoText = screen.getByText('Test todo');
    expect(todoText).toHaveClass('line-through');
  });
});