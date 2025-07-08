import { renderHook, act } from '@testing-library/react';
import { useTodos } from '../useTodos';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => Math.random().toString(36).substring(2, 15),
  },
});

describe('useTodos', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty todos', () => {
    const { result } = renderHook(() => useTodos());
    
    expect(result.current.todos).toEqual([]);
    expect(result.current.activeTodosCount).toBe(0);
    expect(result.current.completedTodosCount).toBe(0);
  });

  it('should add a new todo', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Test todo');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('Test todo');
    expect(result.current.todos[0].completed).toBe(false);
    expect(result.current.activeTodosCount).toBe(1);
  });

  it('should not add empty todo', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('   ');
    });

    expect(result.current.todos).toHaveLength(0);
  });

  it('should toggle todo completion', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Test todo');
    });

    const todoId = result.current.todos[0].id;

    act(() => {
      result.current.toggleTodo(todoId);
    });

    expect(result.current.todos[0].completed).toBe(true);
    expect(result.current.activeTodosCount).toBe(0);
    expect(result.current.completedTodosCount).toBe(1);
  });

  it('should delete a todo', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Test todo');
    });

    const todoId = result.current.todos[0].id;

    act(() => {
      result.current.deleteTodo(todoId);
    });

    expect(result.current.todos).toHaveLength(0);
  });

  it('should edit todo text', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Original text');
    });

    const todoId = result.current.todos[0].id;

    act(() => {
      result.current.editTodo(todoId, 'Updated text');
    });

    expect(result.current.todos[0].text).toBe('Updated text');
  });

  it('should not edit todo with empty text', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Original text');
    });

    const todoId = result.current.todos[0].id;

    act(() => {
      result.current.editTodo(todoId, '   ');
    });

    expect(result.current.todos[0].text).toBe('Original text');
  });

  it('should clear completed todos', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Todo 1');
      result.current.addTodo('Todo 2');
      result.current.addTodo('Todo 3');
    });

    // Complete first and third todos
    act(() => {
      result.current.toggleTodo(result.current.todos[0].id);
      result.current.toggleTodo(result.current.todos[2].id);
    });

    expect(result.current.completedTodosCount).toBe(2);

    act(() => {
      result.current.clearCompleted();
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('Todo 2');
    expect(result.current.completedTodosCount).toBe(0);
  });

  it('should filter todos by status', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Active todo');
      result.current.addTodo('Completed todo');
    });

    // Complete second todo
    act(() => {
      result.current.toggleTodo(result.current.todos[1].id);
    });

    // Test 'all' filter (default)
    expect(result.current.todos).toHaveLength(2);

    // Test 'active' filter
    act(() => {
      result.current.setFilter('active');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('Active todo');

    // Test 'completed' filter
    act(() => {
      result.current.setFilter('completed');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('Completed todo');
  });

  it('should persist todos to localStorage', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Persistent todo');
    });

    const stored = localStorage.getItem('todos');
    expect(stored).toBeTruthy();
    
    const parsedTodos = JSON.parse(stored!);
    expect(parsedTodos).toHaveLength(1);
    expect(parsedTodos[0].text).toBe('Persistent todo');
  });

  it('should load todos from localStorage', () => {
    const mockTodos = [{
      id: 'test-id',
      text: 'Loaded todo',
      completed: false,
      createdAt: new Date().toISOString(),
    }];

    localStorage.setItem('todos', JSON.stringify(mockTodos));

    const { result } = renderHook(() => useTodos());

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('Loaded todo');
  });
});