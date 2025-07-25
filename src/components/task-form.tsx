import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState, useRef } from 'react';
import { mockTeamMembers, COLORS } from '../constants';
import toast from 'react-hot-toast';
import FormRow from './ui/form-row';
import InputGroup from './ui/input-group';
import InputLabel from './ui/input-label';
import InputController from './ui/input-controller';
import SelectBoxController from './ui/select-box-controller';
import Form from './ui/form';
import { Task } from '@/types';
import { useTasks } from '@/stores/useTasks';
import { TaskFormValues, taskSchema } from '@/utils/validation';

interface TaskFormProps {
  initialTask?: Task;
  onClose?: () => void;
}

export function TaskForm({ initialTask, onClose }: TaskFormProps) {
  const { addTask, updateTask, loading, error } = useTasks();
  const isEdit = !!initialTask;
  const [assigneeInput, setAssigneeInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  // Convert date strings to Date objects for initialTask
  const safeTask = initialTask
    ? {
        ...initialTask,
        dueDate:
          typeof initialTask.dueDate === 'string'
            ? new Date(initialTask.dueDate)
            : initialTask.dueDate,
        createdAt:
          typeof initialTask.createdAt === 'string'
            ? new Date(initialTask.createdAt)
            : initialTask.createdAt,
        updatedAt:
          typeof initialTask.updatedAt === 'string'
            ? new Date(initialTask.updatedAt)
            : initialTask.updatedAt,
      }
    : undefined;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: safeTask
      ? {
          ...safeTask,
          dueDate: safeTask.dueDate.toISOString().slice(0, 10),
          tags: safeTask.tags.join(', '),
          estimatedTime: safeTask.estimatedTime?.toString() || '',
        }
      : {
          title: '',
          description: '',
          priority: 'medium',
          status: 'todo',
          category: '',
          tags: '',
          dueDate: '',
          assignedTo: '',
          estimatedTime: '',
        },
  });

  useEffect(() => {
    if (safeTask) {
      reset({
        ...safeTask,
        dueDate: safeTask.dueDate.toISOString().slice(0, 10),
        tags: safeTask.tags.join(', '),
        estimatedTime: safeTask.estimatedTime?.toString() || '',
      });
    }
    // Only run when the task ID changes
  }, [safeTask?.id, reset]);

  // Watch assignedTo for input value
  const assignedTo = watch('assignedTo');

  useEffect(() => {
    setAssigneeInput(assignedTo || '');
  }, [assignedTo]);

  // const filteredMembers = assigneeInput
  //   ? mockTeamMembers.filter((name) => name.toLowerCase().includes(assigneeInput.toLowerCase()))
  //   : mockTeamMembers;

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions]);

  const onSubmit = async (data: TaskFormValues) => {
    const tags = data.tags ? data.tags.split(',').map((t) => t.trim()) : [];
    const estimatedTime = data.estimatedTime ? Number(data.estimatedTime) : undefined;
    const task: Task = {
      id: isEdit ? safeTask!.id : uuidv4(),
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status,
      category: data.category,
      tags,
      dueDate: new Date(data.dueDate),
      createdAt: isEdit ? safeTask!.createdAt : new Date(),
      updatedAt: new Date(),
      assignedTo: data.assignedTo,
      estimatedTime,
    };
    try {
      if (isEdit) {
        await updateTask(task);
        toast.success('Task updated!');
      } else {
        await addTask(task);
        toast.success('Task created!');
      }
      if (onClose) onClose();
      reset();
    } catch {
      toast.error('Failed to save task.');
    }
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full space-y-4 overflow-y-auto  z-50 md:w-[550px] md:h-[650px] sm:rounded-lg shadow relative bg-[var(--color-bg-paper)] flex flex-col"
    >
      <div className="overflow-y-auto flex-1 p-6 space-y-4 task-form-scroll">
        <FormRow>
          <InputGroup>
            <InputLabel
              name="title"
              hasError={!!errors.title}
            >
              Title
            </InputLabel>
            <InputController
              control={control}
              name="title"
              type="text"
              rules={{ required: 'Title is required' }}
              placeholder="Enter title"
            />
          </InputGroup>
        </FormRow>
        <FormRow>
          <InputGroup>
            <InputLabel
              name="description"
              hasError={!!errors.description}
            >
              Description
            </InputLabel>
            <textarea
              className="w-full p-2 border rounded"
              {...register('description')}
            />
            {errors.description && (
              <span className="text-red-500 text-xs">{errors.description.message}</span>
            )}
          </InputGroup>
        </FormRow>
        <FormRow>
          <InputGroup className="flex-1">
            <InputLabel name="priority">Priority</InputLabel>
            <SelectBoxController
              control={control}
              name="priority"
              options={[
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
              ]}
              rules={{ required: 'Priority is required' }}
            />
          </InputGroup>
          <InputGroup className="flex-1">
            <InputLabel name="status">Status</InputLabel>
            <SelectBoxController
              control={control}
              name="status"
              options={[
                { label: 'Todo', value: 'todo' },
                { label: 'In Progress', value: 'in-progress' },
                { label: 'Done', value: 'done' },
              ]}
              rules={{ required: 'Status is required' }}
            />
          </InputGroup>
        </FormRow>
        <FormRow>
          <InputGroup>
            <InputLabel
              name="category"
              hasError={!!errors.category}
            >
              Category
            </InputLabel>
            <InputController
              control={control}
              name="category"
              type="text"
              rules={{ required: 'Category is required' }}
              placeholder="Enter category"
            />
          </InputGroup>
        </FormRow>
        <FormRow>
          <InputGroup>
            <InputLabel name="tags">Tags (comma separated)</InputLabel>
            <InputController
              control={control}
              name="tags"
              type="text"
              placeholder="tag1, tag2"
            />
          </InputGroup>
        </FormRow>
        <FormRow>
          <InputGroup>
            <InputLabel
              name="dueDate"
              hasError={!!errors.dueDate}
            >
              Due Date
            </InputLabel>
            <InputController
              control={control}
              name="dueDate"
              type="date"
              rules={{ required: 'Due date is required' }}
            />
          </InputGroup>
        </FormRow>
        <FormRow>
          <InputGroup>
            <InputLabel name="assignedTo">Assigned To</InputLabel>
            <SelectBoxController
              control={control}
              name="assignedTo"
              options={[
                { label: 'Select assignee', value: '' },
                ...mockTeamMembers.map((name) => ({ label: name, value: name })),
              ]}
            />
          </InputGroup>
        </FormRow>
        <FormRow>
          <InputGroup>
            <InputLabel name="estimatedTime">Estimated Time (minutes)</InputLabel>
            <InputController
              control={control}
              name="estimatedTime"
              type="number"
              placeholder="e.g. 60"
            />
          </InputGroup>
        </FormRow>
      </div>

      <div className="flex gap-2 justify-end p-4 border-t border-gray-200 dark:border-gray-700 bg-[var(--color-bg-paper)] sticky bottom-0 left-0 z-10">
        {error && <span className="text-red-500 text-xs flex-1 self-center">{error}</span>}
        {onClose && (
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          disabled={loading}
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {isEdit ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </Form>
  );
}
