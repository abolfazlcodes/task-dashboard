import { useInView } from '@/hooks/useInView';
import { Task } from '@/types';
import React from 'react';
import { TaskCard } from './task-card';

interface TaskListProps {
  tasks: Task[];
  sortBy: 'priority' | 'dueDate' | 'status';
  onEdit?: (task: Task) => void;
  selectedTaskIds?: string[];
  onTaskCheckbox?: (
    taskId: string,
    checked: boolean,
    index: number,
    event: React.MouseEvent<HTMLInputElement>
  ) => void;
}

function LazyTaskCard({ children }: { children: React.ReactNode }) {
  const [ref, isInView] = useInView();
  return (
    <div
      ref={ref}
      className="flex-1 w-full"
    >
      {isInView ? children : <div className="flex-1 w-full bg-transparent rounded-lg shadow" />}
    </div>
  );
}

export function TaskList({ tasks, onEdit, selectedTaskIds = [], onTaskCheckbox }: TaskListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full">
      {tasks.map((task, idx) => (
        <div
          key={task.id}
          className="relative group h-full flex"
        >
          {onTaskCheckbox && (
            <div className="absolute top-2 right-2 z-20 flex items-center">
              <input
                type="checkbox"
                checked={selectedTaskIds.includes(task.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  onTaskCheckbox &&
                    onTaskCheckbox(task.id, !selectedTaskIds.includes(task.id), idx, e);
                }}
                className="w-5 h-5 accent-blue-600 border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-150 hover:scale-110 bg-white"
                aria-label={`Select task ${task.title}`}
              />
            </div>
          )}
          <LazyTaskCard>
            <TaskCard
              task={task}
              onEdit={onEdit}
              showCheckbox={!!onTaskCheckbox}
              checked={selectedTaskIds.includes(task.id)}
              onCheckboxChange={(checked) =>
                onTaskCheckbox &&
                onTaskCheckbox(task.id, checked, idx, {} as React.MouseEvent<HTMLInputElement>)
              }
              className="flex-1 min-h-[320px]"
            />
          </LazyTaskCard>
        </div>
      ))}
    </div>
  );
}
