import { BASE_URL } from '@/constants/env-variables';
import TaskDashboard from '../components/ui/TaskDashboard';

export default async function Home() {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    cache: 'no-store',
  });
  const tasks = await res.json();

  return (
    <div>
      <TaskDashboard initialTasks={tasks} />
    </div>
  );
}
