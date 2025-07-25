import { useEffect, useRef, useState } from 'react';
import { Task } from '@/types/index';

interface TaskCardMenuProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete: () => void;
  onToggleComplete: () => void;
}

function TaskCardMenu({ task, onEdit, onDelete, onToggleComplete }: TaskCardMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <div className="relative z-20">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen((v) => !v);
        }}
        data-testid="task-menu-button"
        aria-label="Task actions"
        className="w-7 h-7 flex items-center justify-center rounded-full transition text-[var(--color-text-primary)]"
      >
        <svg
          width="18"
          height="18"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <circle
            cx="4"
            cy="10"
            r="1.5"
          />
          <circle
            cx="10"
            cy="10"
            r="1.5"
          />
          <circle
            cx="16"
            cy="10"
            r="1.5"
          />
        </svg>
      </button>

      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 bottom-8 w-32 bg-[var(--color-bg-paper)] rounded-lg shadow-lg border border-[var(--color-divider)] py-1 animate-fade-in z-30"
        >
          <div className="relative z-20">
            <button
              className="w-7 h-7 flex items-center justify-center rounded-full transition text-[var(--color-text-primary)]"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              aria-label="Task actions"
            ></button>
            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 bottom-8 w-32 bg-[var(--color-bg-paper)] rounded-lg shadow-lg border border-[var(--color-divider)] py-1 animate-fade-in z-30"
                style={{ animation: 'fade-in 0.15s cubic-bezier(.4,0,.2,1)' }}
              >
                <button
                  className="w-full text-left px-3 py-1 text-xs hover:bg-[var(--color-bg-neutral)] transition text-[var(--color-text-primary)]"
                  onClick={() => {
                    setMenuOpen(false);

                    onToggleComplete();
                  }}
                >
                  {task.status === 'done' ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
                <button
                  className="w-full text-left px-3 py-1 text-xs hover:bg-[var(--color-bg-neutral)] transition text-[var(--color-text-primary)]"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit && onEdit(task);
                  }}
                >
                  Edit
                </button>
                <button
                  className="w-full text-left px-3 py-1 text-xs text-red-600 hover:bg-red-50 transition"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete();
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskCardMenu;
