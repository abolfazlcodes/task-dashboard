import { Task } from '@/types';

export type TaskSortBy = 'priority' | 'dueDate' | 'status';

export function sortTasks(tasks: Task[], sortBy: TaskSortBy): Task[] {
  return [...tasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    }
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (sortBy === 'status') {
      const order = { todo: 0, 'in-progress': 1, done: 2 };
      return order[a.status] - order[b.status];
    }
    return 0;
  });
}
