import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['todo', 'in-progress', 'done']),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().optional(), // comma separated
  dueDate: z.string().min(1, 'Due date is required'),
  assignedTo: z.string().optional(),
  estimatedTime: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
