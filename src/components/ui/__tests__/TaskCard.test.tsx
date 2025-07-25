import { Task } from '@/types';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskCard } from '../task-card';
import * as useTasksHook from '@/stores/useTasks';
vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test description',
  status: 'todo',
  priority: 'medium',
  dueDate: new Date(),
  tags: ['frontend', 'bug'],
  category: 'work',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('TaskCard', () => {
  const mockDeleteTask = vi.fn().mockResolvedValue(undefined);
  const mockToggleComplete = vi.fn();

  beforeEach(() => {
    vi.spyOn(useTasksHook, 'useTasks').mockReturnValue({
      deleteTask: mockDeleteTask,
      toggleComplete: mockToggleComplete,
    });
  });

  it('renders task data correctly', () => {
    render(
      <TaskCard
        task={mockTask}
        className="test"
      />
    );
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('todo')).toBeInTheDocument();
    expect(screen.getByText(/Due:/)).toBeInTheDocument();
    expect(screen.getByText('#frontend')).toBeInTheDocument();
    expect(screen.getByText('#bug')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('calls toggleComplete when onToggleComplete is clicked from menu', async () => {
    render(
      <TaskCard
        task={mockTask}
        className="test"
      />
    );
    const menuButton = screen.getByRole('button', { name: /task actions/i });

    fireEvent.click(menuButton);
    const completeBtn = await screen.findByText(/mark complete/i);
    fireEvent.click(completeBtn);

    expect(mockToggleComplete).toHaveBeenCalledWith(mockTask.id);
  });

  it('opens delete modal and deletes task on confirm', async () => {
    render(
      <TaskCard
        task={mockTask}
        className="test"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /task actions/i }));
    fireEvent.click(await screen.findByText(/delete/i));

    await waitFor(() => {
      expect(
        screen.getByText('Are you sure you want to delete the task "Test Task"?')
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(mockDeleteTask).toHaveBeenCalledWith(mockTask.id);
    });
  });

  it('calls onEdit when edit menu item clicked', async () => {
    const onEdit = vi.fn();
    render(
      <TaskCard
        task={mockTask}
        onEdit={onEdit}
        className="test"
      />
    );

    fireEvent.click(screen.getByTestId('task-menu-button'));
    const editBtn = await screen.findByText(/edit/i);
    fireEvent.click(editBtn);

    expect(onEdit).toHaveBeenCalledWith(mockTask);
  });
});
