export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  category: string;
  tags: string[];
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  estimatedTime?: number; // in minutes
}

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'done';
