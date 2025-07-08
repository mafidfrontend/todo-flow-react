import { useState } from 'react';
import { Check, Edit2, Trash2, X } from 'lucide-react';
import { Todo } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete, onEdit }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editText.trim() && editText.trim() !== todo.text) {
      onEdit(todo.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  return (
    <div className={cn(
      "group flex items-center gap-4 p-4 bg-gradient-card rounded-lg shadow-card border border-gray-100/50 transition-all duration-300 hover:shadow-hover animate-fade-in",
      todo.completed && "opacity-70"
    )}>
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={cn(
          "flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-300 shrink-0",
          todo.completed
            ? "bg-todo-success border-todo-success text-white"
            : "border-gray-300 hover:border-todo-primary"
        )}
      >
        {todo.completed && <Check className="w-4 h-4" />}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="flex gap-2">
            <Input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-1 h-8 text-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleEditCancel();
                }
              }}
            />
            <Button type="submit" size="sm" variant="todo-outline" className="h-8 px-2">
              <Check className="w-3 h-3" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleEditCancel}
              className="h-8 px-2"
            >
              <X className="w-3 h-3" />
            </Button>
          </form>
        ) : (
          <p
            className={cn(
              "text-sm leading-relaxed break-words",
              todo.completed && "line-through text-gray-500"
            )}
          >
            {todo.text}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      {!isEditing && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 p-0 hover:bg-todo-primary-light hover:text-todo-primary"
          >
            <Edit2 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(todo.id)}
            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
};