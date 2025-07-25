import { useTaskColors } from '@/hooks/useTaskColors';
import { useTasks } from '@/stores/useTasks';
import { Task } from '@/types';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Badge from './TagBadge';
import { getColorIndex } from '@/utils/colors';
import TaskCardMenu from './TaskCardMenu';
import DeleteModal from './DeleteModal';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  showCheckbox?: boolean;
  checked?: boolean;
  onCheckboxChange?: (checked: boolean) => void;
  className: string;
}

/**
 * TaskCard displays all details for a single task, including title, description, status, priority, category, tags, due date, and assigned user.
 * - Uses theme-aware color coding for priority, category, and tags.
 * - Designed for accessibility and responsive layouts.
 * - Used throughout the dashboard for both list and detail views.
 *
 * @param task The task object to display
 * @param onEdit Optional callback for editing the task
 * @param showCheckbox Whether to show a selection checkbox
 * @param checked Whether the checkbox is checked
 * @param onCheckboxChange Handler for checkbox state change
 * @param className Additional class names for styling
 */
export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { deleteTask, toggleComplete } = useTasks();
  const [showDelete, setShowDelete] = useState(false);
  const { tagPalette, tagTextPalette, priorityBg, priorityText } = useTaskColors(task);

  async function handleDelete() {
    try {
      await deleteTask(task.id);
      toast.success('Task deleted!');
    } catch {
      toast.error('Failed to delete task.');
    } finally {
      setShowDelete(false);
    }
  }

  return (
    <div className="bg-[var(--color-bg-paper)] rounded-lg shadow p-4 flex flex-col gap-2 border border-[var(--color-divider)] relative">
      {/* Top bar: checkbox, title */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-shrink-0">
          <h3 className="font-semibold text-lg truncate max-w-[120px] sm:max-w-[180px] text-[var(--color-text-primary)]">
            {task.title}
          </h3>
        </div>
      </div>
      <p className="text-[var(--color-text-secondary)] text-sm">{task.description}</p>
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="bg-[var(--color-bg-neutral)] px-2 py-1 rounded text-[var(--color-text-secondary)]">
          {task.status}
        </span>
        <span className="bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] px-2 py-1 rounded">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </span>
        {task.category && (
          <Badge
            label={task.category}
            bgColor={tagPalette[getColorIndex(task.category, tagPalette.length)]}
            textColor={tagTextPalette[getColorIndex(task.category, tagTextPalette.length)]}
            title={`Category: ${task.category}`}
          />
        )}
        {task.tags?.map((tag) => (
          <Badge
            key={tag}
            label={`#${tag}`}
            bgColor={tagPalette[getColorIndex(tag, tagPalette.length)]}
            textColor={tagTextPalette[getColorIndex(tag, tagTextPalette.length)]}
            title={`Tag: ${tag}`}
            className="opacity-80"
          />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4 justify-between">
        <span
          className="px-2 py-1 rounded text-xs font-bold relative z-10 overflow-visible animate-priority-glow"
          style={{
            background: priorityBg,
            color: priorityText,
            boxShadow:
              task.priority === 'high'
                ? '0 0 4px 1px rgba(239,68,68,0.4)'
                : task.priority === 'medium'
                  ? '0 0 8px 2px rgba(251,191,36,0.4)'
                  : '0 0 8px 2px rgba(34,197,94,0.4)',
          }}
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
        <TaskCardMenu
          task={task}
          onEdit={onEdit}
          onToggleComplete={() => toggleComplete(task.id)}
          onDelete={() => setShowDelete(true)}
        />
      </div>
      <DeleteModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onDelete={handleDelete}
        message={`Are you sure you want to delete the task "${task.title}"?`}
      />
    </div>
  );
}
