import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TodoInputProps {
  onAddTodo: (text: string) => void;
}

export const TodoInput = ({ onAddTodo }: TodoInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTodo(inputValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
      <div className="flex-1">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task..."
          className="h-12 text-base border-2 border-gray-200 focus:border-todo-primary bg-white/80 backdrop-blur-sm shadow-card transition-all duration-300"
        />
      </div>
      <Button 
        type="submit" 
        variant="todo"
        size="lg"
        className="h-12 px-6 shrink-0"
        disabled={!inputValue.trim()}
      >
        <Plus className="w-5 h-5" />
        Add Task
      </Button>
    </form>
  );
};