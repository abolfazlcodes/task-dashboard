import { create } from 'zustand';
import { useEffect } from 'react';
import { Task } from '@/types/index';
import { useUndoRedo } from './useUndoRedo';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  setTasks: (tasks: Task[]) => void;
  exportTasks: (format: 'json' | 'csv') => void;
}

const LOCAL_KEY = 'tasks_local';

export const useTasks = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      set({ tasks: data, loading: false });
      try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
      } catch {}
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, loading: false });
      } else {
        set({ error: 'Unknown error', loading: false });
      }
    }
  },

  addTask: async (task: Task) => {
    useUndoRedo.getState().pushAction({ type: 'create', task });
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (!res.ok) throw new Error('Failed to add task');
      await get().fetchTasks();
      set({ loading: false });
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, loading: false });
      } else {
        set({ error: 'Unknown error', loading: false });
      }
    }
  },

  updateTask: async (task: Task) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (!res.ok) throw new Error('Failed to update task');
      await get().fetchTasks();
      set({ loading: false });
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, loading: false });
      } else {
        set({ error: 'Unknown error', loading: false });
      }
    }
  },

  deleteTask: async (id: string) => {
    const task = get().tasks.find((t) => t.id === id);
    if (task) useUndoRedo.getState().pushAction({ type: 'delete', task });
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete task');
      await get().fetchTasks();
      set({ loading: false });
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, loading: false });
      } else {
        set({ error: 'Unknown error', loading: false });
      }
    }
  },

  toggleComplete: async (id: string) => {
    const task = get().tasks.find((t) => t.id === id);
    if (task) useUndoRedo.getState().pushAction({ type: 'toggle', task, prevStatus: task.status });
    set({ loading: true, error: null });
    try {
      if (!task) throw new Error('Task not found');
      const updated = {
        ...task,
        status: (task.status === 'done' ? 'todo' : 'done') as Task['status'],
        updatedAt: new Date(),
      };
      await get().updateTask(updated);
      set({ loading: false });
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, loading: false });
      } else {
        set({ error: 'Unknown error', loading: false });
      }
    }
  },

  setTasks: (tasks: Task[]) => {
    set({ tasks });
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(tasks));
    } catch {}
  },

  exportTasks: (format: 'json' | 'csv') => {
    const tasks = get().tasks;
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tasks.json';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // CSV
      const header = Object.keys(tasks[0] || {}).join(',');
      const rows = tasks.map((t) =>
        Object.values(t)
          .map((v) => `"${Array.isArray(v) ? v.join(';') : v}"`)
          .join(',')
      );
      const csv = [header, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tasks.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
  },
}));

// LocalStorage sync on mount and on tasks change
export function useTasksLocalSync() {
  const { tasks, setTasks } = useTasks();
  useEffect(() => {
    const local = localStorage.getItem(LOCAL_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) setTasks(parsed);
      } catch {}
    }
  }, [setTasks]);
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(tasks));
  }, [tasks]);
}
