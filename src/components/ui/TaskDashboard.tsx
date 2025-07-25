'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { TaskList } from '../ui/TaskList';
import { TaskForm } from '../task-form';
import Modal from '../ui/modal';
import BaseSelectBox from '../ui/select-box';
import toast, { Toaster } from 'react-hot-toast';
import { useTasks, useTasksLocalSync } from '@/stores/useTasks';
import { Task } from '@/types';
import { useUndoRedo } from '@/stores/useUndoRedo';
import { useDebounce } from '@/hooks/useDebounce';
import ShortcutsModal from './ShortcutsModal';
import DeleteModal from './DeleteModal';

export default function TaskDashboard({ initialTasks = [] }) {
  const { tasks, loading, error, setTasks } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'status'>('priority');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (
        (localStorage.getItem('theme') as 'light' | 'dark') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      );
    }
    return 'light';
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const { deleteTask, updateTask, fetchTasks } = useTasks();
  useTasksLocalSync();
  const { exportTasks } = useTasks();
  const undoRedo = useUndoRedo();
  const tasksStore = useTasks();
  const [showShortcuts, setShowShortcuts] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebounce(search, 400);

  // Get unique categories from tasks
  const categories = useMemo(() => {
    const set = new Set(tasks.map((t) => t.category).filter(Boolean));
    return Array.from(set);
  }, [tasks]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search
      const q = debouncedSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q) ||
        (task.tags && task.tags.some((tag) => tag.toLowerCase().includes(q)));
      // Status
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      // Priority
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      // Category
      const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tasks, debouncedSearch, statusFilter, priorityFilter, categoryFilter]);

  const handleAdd = useCallback(() => {
    setEditingTask(null);
    setShowForm(true);
  }, []);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  // Handle individual checkbox click (with shift-click support)
  const handleTaskCheckbox = (
    taskId: string,
    checked: boolean,
    index: number,
    event: React.MouseEvent<HTMLInputElement>
  ) => {
    if (event.shiftKey && lastSelectedIndex !== null) {
      // Range select
      const indices = filteredTasks.map((t, i) => ({ id: t.id, i }));
      const currentIdx = index;
      const start = Math.min(lastSelectedIndex, currentIdx);
      const end = Math.max(lastSelectedIndex, currentIdx);
      const rangeIds = indices.slice(start, end + 1).map((x) => x.id);
      const newSelected = checked
        ? Array.from(new Set([...selectedTaskIds, ...rangeIds]))
        : selectedTaskIds.filter((id) => !rangeIds.includes(id));
      setSelectedTaskIds(newSelected);
    } else {
      setSelectedTaskIds(
        checked
          ? Array.from(new Set([...selectedTaskIds, taskId]))
          : selectedTaskIds.filter((id) => id !== taskId)
      );
      setLastSelectedIndex(index);
    }
  };

  // Select all checkbox
  const allSelected =
    filteredTasks.length > 0 && filteredTasks.every((t) => selectedTaskIds.includes(t.id));
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedTaskIds(checked ? filteredTasks.map((t) => t.id) : []);
    },
    [filteredTasks]
  );

  // Bulk delete handler
  const handleBulkDelete = async () => {
    for (const id of selectedTaskIds) {
      await deleteTask(id);
    }
    setSelectedTaskIds([]);
    setShowBulkDelete(false);
    await fetchTasks();
  };

  // Bulk status change handler
  const handleBulkStatus = async (status: 'todo' | 'in-progress' | 'done') => {
    for (const id of selectedTaskIds) {
      const task = tasks.find((t) => t.id === id);
      if (task && task.status !== status) {
        await updateTask({ ...task, status });
      }
    }
    setSelectedTaskIds([]);
    await fetchTasks();
  };

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks, setTasks]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Undo handler
  const handleUndo = useCallback(async () => {
    const action = undoRedo.undo();
    if (!action) return;
    if (action.type === 'delete') {
      // Re-create the deleted task
      await tasksStore.addTask(action.task);
    } else if (action.type === 'create') {
      // Delete the created task
      await tasksStore.deleteTask(action.task.id);
    } else if (action.type === 'toggle') {
      // Toggle back to previous status
      await tasksStore.updateTask({
        ...action.task,
        status: action.prevStatus,
      });
    }
  }, [tasksStore, undoRedo]);
  // Redo handler
  const handleRedo = useCallback(async () => {
    const action = undoRedo.redo();
    if (!action) return;
    if (action.type === 'delete') {
      // Delete the task again
      await tasksStore.deleteTask(action.task.id);
    } else if (action.type === 'create') {
      // Re-create the task
      await tasksStore.addTask(action.task);
    } else if (action.type === 'toggle') {
      // Toggle again
      const newStatus = action.task.status === 'done' ? 'todo' : 'done';
      await tasksStore.updateTask({ ...action.task, status: newStatus });
    }
  }, [tasksStore, undoRedo]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowShortcuts(true);
      } else if (e.ctrlKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        handleAdd();
      } else if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      } else if (e.ctrlKey && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.ctrlKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.ctrlKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleSelectAll(true);
      } else if (e.key === 'Escape') {
        setShowForm(false);
        setShowShortcuts(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAdd, handleUndo, handleRedo, setShowForm, setShowShortcuts, handleSelectAll]);

  const handleUndoWithToast = async () => {
    try {
      await handleUndo();
      toast.success('Undo successful!');
    } catch {
      toast.error('Nothing to undo.');
    }
  };
  const handleRedoWithToast = async () => {
    try {
      await handleRedo();
      toast.success('Redo successful!');
    } catch {
      toast.error('Nothing to redo.');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-default)] py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4 text-center text-[var(--color-primary-main)] font-medium">
          Press{' '}
          <span className="font-mono bg-[var(--color-bg-neutral)] px-2 py-1 rounded">Ctrl+K</span>{' '}
          to view keyboard shortcuts.
        </div>
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Task Management Dashboard
          </h1>
          <div className="flex gap-2 items-center">
            <button
              className="px-4 py-2 rounded bg-[var(--color-bg-neutral)] text-[var(--color-text-primary)] font-semibold shadow hover:bg-[var(--color-bg-paper)] transition"
              onClick={toggleTheme}
              aria-label="Toggle light/dark mode"
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
            <button
              className="px-5 py-2 rounded bg-[var(--color-primary-main)] text-white font-semibold shadow hover:bg-[var(--color-primary-light)] transition"
              onClick={handleAdd}
            >
              + Add Task
            </button>
          </div>
        </header>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-2 items-center w-full">
            <input
              ref={searchInputRef}
              type="text"
              className="p-2 border rounded w-full sm:w-64 text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <BaseSelectBox
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border rounded text-[var(--color-text-primary)]"
            >
              <option value="all">All Statuses</option>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </BaseSelectBox>
            <BaseSelectBox
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="p-2 border rounded text-[var(--color-text-primary)]"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </BaseSelectBox>
            <BaseSelectBox
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-2 border rounded text-[var(--color-text-primary)]"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                >
                  {cat}
                </option>
              ))}
            </BaseSelectBox>
            <div className="flex items-center gap-2 ml-auto">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-5 h-5"
                aria-label="Select all tasks"
              />
              <span className="text-sm text-nowrap text-[var(--color-text-primary)]">
                Select All
              </span>
              <button
                className="px-3 py-1 text-nowrap rounded bg-[var(--color-bg-neutral)] text-[var(--color-text-primary)] text-sm hover:bg-[var(--color-bg-paper)] transition ml-2"
                onClick={() => exportTasks('csv')}
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>

        <Toaster position="top-center" />
        <Modal
          isOpen={showForm}
          onClose={handleCloseForm}
        >
          <TaskForm
            initialTask={editingTask || undefined}
            onClose={handleCloseForm}
          />
        </Modal>
        <ShortcutsModal
          isOpen={showShortcuts}
          onClose={() => setShowShortcuts(false)}
        />

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-10">{error}</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-gray-500 text-center py-10">
            No tasks found. Start by adding a task!
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            sortBy={sortBy}
            onEdit={handleEdit}
            selectedTaskIds={selectedTaskIds}
            onTaskCheckbox={handleTaskCheckbox}
          />
        )}
      </div>
      {/* Bulk action bar */}
      {selectedTaskIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--color-bg-paper)] border border-[var(--color-divider)] rounded-lg shadow-lg px-6 py-3 flex items-center gap-4 animate-fade-in">
          <span className="font-medium text-sm text-[var(--color-text-primary)]">
            {selectedTaskIds.length} selected
          </span>
          <button
            className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition"
            onClick={() => setShowBulkDelete(true)}
          >
            Delete Selected
          </button>
          <select
            className="p-2 border rounded text-sm text-[var(--color-text-primary)]"
            defaultValue=""
            onChange={(e) => {
              const val = e.target.value as 'todo' | 'in-progress' | 'done';
              if (val) handleBulkStatus(val);
            }}
          >
            <option
              value=""
              disabled
            >
              Change Status
            </option>
            <option value="todo">Mark as Todo</option>
            <option value="in-progress">Mark as In Progress</option>
            <option value="done">Mark as Done</option>
          </select>
        </div>
      )}
      {/* Sticky undo/redo menu */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 items-end animate-fade-in">
        <button
          className="px-3 py-1 rounded bg-[var(--color-bg-neutral)] text-[var(--color-text-primary)] text-sm hover:bg-[var(--color-bg-paper)] transition disabled:opacity-50"
          onClick={handleUndoWithToast}
          disabled={!undoRedo.canUndo}
        >
          Undo
        </button>
        <button
          className="px-3 py-1 rounded bg-[var(--color-bg-neutral)] text-[var(--color-text-primary)] text-sm hover:bg-[var(--color-bg-paper)] transition disabled:opacity-50"
          onClick={handleRedoWithToast}
          disabled={!undoRedo.canRedo}
        >
          Redo
        </button>
      </div>
      <DeleteModal
        isOpen={showBulkDelete}
        onClose={() => setShowBulkDelete(false)}
        onDelete={handleBulkDelete}
        message={`Are you sure you want to delete ${selectedTaskIds.length} selected tasks?`}
      />
    </div>
  );
}
