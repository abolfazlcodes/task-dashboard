import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskList } from '../TaskList';
import { Task } from '@/types';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'desc',
    priority: 'high',
    status: 'todo',
    category: 'dev',
    tags: ['frontend'],
    dueDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Test Task 2',
    description: 'desc',
    priority: 'medium',
    status: 'in-progress',
    category: 'design',
    tags: ['ui'],
    dueDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

vi.mock('@/hooks/useInView', () => ({
  useInView: () => [React.createRef(), true],
}));

describe('TaskList', () => {
  it('renders all task titles', () => {
    render(
      <TaskList
        tasks={mockTasks}
        sortBy="priority"
      />
    );
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  it('renders checkboxes if onTaskCheckbox prop is provided', () => {
    render(
      <TaskList
        tasks={mockTasks}
        sortBy="priority"
        selectedTaskIds={['1']}
        onTaskCheckbox={vi.fn()}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(mockTasks.length);
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('does not render checkboxes if onTaskCheckbox prop is missing', () => {
    render(
      <TaskList
        tasks={mockTasks}
        sortBy="priority"
      />
    );
    const checkboxes = screen.queryAllByRole('checkbox');
    expect(checkboxes.length).toBe(0);
  });

  it('calls onTaskCheckbox with correct params when checkbox clicked', () => {
    const onCheckbox = vi.fn();
    render(
      <TaskList
        tasks={mockTasks}
        sortBy="priority"
        selectedTaskIds={[]}
        onTaskCheckbox={onCheckbox}
      />
    );

    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);
    expect(onCheckbox).toHaveBeenCalledWith('1', true, 0, expect.any(Object));
  });
});
