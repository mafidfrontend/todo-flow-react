import { CheckSquare } from 'lucide-react';
import { useTodos } from '@/hooks/useTodos';
import { TodoInput } from './TodoInput';
import { TodoList } from './TodoList';
import { TodoFilters } from './TodoFilters';

export const TodoApp = () => {
  const {
    todos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    activeTodosCount,
    completedTodosCount,
  } = useTodos();

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-2xl shadow-soft">
              <CheckSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              TodoFlow
            </h1>
          </div>
          <p className="text-gray-600">Stay organized and get things done</p>
        </div>

        {/* Todo Input */}
        <TodoInput onAddTodo={addTodo} />

        {/* Todo Filters */}
        <div className="mb-6">
          <TodoFilters
            currentFilter={filter}
            onFilterChange={setFilter}
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            onClearCompleted={clearCompleted}
          />
        </div>

        {/* Todo List */}
        <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6 shadow-card border border-white/20">
          <TodoList
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Built with React, TypeScript, and ❤️</p>
        </div>
      </div>
    </div>
  );
};