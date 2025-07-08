import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { TodoInput } from '../TodoInput';

describe('TodoInput', () => {
  const mockOnAddTodo = vi.fn();

  beforeEach(() => {
    mockOnAddTodo.mockClear();
  });

  it('renders input field and add button', () => {
    render(<TodoInput onAddTodo={mockOnAddTodo} />);
    
    expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('calls onAddTodo when form is submitted', async () => {
    const user = userEvent.setup();
    render(<TodoInput onAddTodo={mockOnAddTodo} />);
    
    const input = screen.getByPlaceholderText('Add a new task...');
    const button = screen.getByRole('button', { name: /add task/i });
    
    await user.type(input, 'New task');
    await user.click(button);
    
    expect(mockOnAddTodo).toHaveBeenCalledWith('New task');
  });

  it('clears input after adding todo', async () => {
    const user = userEvent.setup();
    render(<TodoInput onAddTodo={mockOnAddTodo} />);
    
    const input = screen.getByPlaceholderText('Add a new task...');
    
    await user.type(input, 'New task{enter}');
    
    expect(input).toHaveValue('');
  });

  it('does not call onAddTodo with empty input', async () => {
    const user = userEvent.setup();
    render(<TodoInput onAddTodo={mockOnAddTodo} />);
    
    const button = screen.getByRole('button', { name: /add task/i });
    
    await user.click(button);
    
    expect(mockOnAddTodo).not.toHaveBeenCalled();
  });

  it('disables button when input is empty', () => {
    render(<TodoInput onAddTodo={mockOnAddTodo} />);
    
    const button = screen.getByRole('button', { name: /add task/i });
    
    expect(button).toBeDisabled();
  });
});