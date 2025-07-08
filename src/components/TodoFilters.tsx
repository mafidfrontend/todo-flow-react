import { FilterType } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TodoFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  activeTodosCount: number;
  completedTodosCount: number;
  onClearCompleted: () => void;
}

export const TodoFilters = ({ 
  currentFilter, 
  onFilterChange, 
  activeTodosCount, 
  completedTodosCount,
  onClearCompleted 
}: TodoFiltersProps) => {
  const filters: { key: FilterType; label: string; count?: number }[] = [
    { key: 'all', label: 'All', count: activeTodosCount + completedTodosCount },
    { key: 'active', label: 'Active', count: activeTodosCount },
    { key: 'completed', label: 'Completed', count: completedTodosCount },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-100/50 shadow-card">
      {/* Filter Buttons */}
      <div className="flex gap-1 p-1 bg-gray-100/80 rounded-lg">
        {filters.map(({ key, label, count }) => (
          <Button
            key={key}
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange(key)}
            className={cn(
              "relative px-4 py-2 transition-all duration-200",
              currentFilter === key
                ? "bg-white text-todo-primary shadow-sm font-medium"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            {label}
            {count !== undefined && (
              <span className={cn(
                "ml-2 px-2 py-0.5 text-xs rounded-full",
                currentFilter === key
                  ? "bg-todo-primary-light text-todo-primary"
                  : "bg-gray-200 text-gray-600"
              )}>
                {count}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Tasks Remaining & Clear Completed */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-600">
          {activeTodosCount} {activeTodosCount === 1 ? 'task' : 'tasks'} remaining
        </span>
        
        {completedTodosCount > 0 && (
          <Button
            variant="todo-outline"
            size="sm"
            onClick={onClearCompleted}
            className="h-8 text-xs"
          >
            Clear Completed ({completedTodosCount})
          </Button>
        )}
      </div>
    </div>
  );
};