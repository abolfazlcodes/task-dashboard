import TaskDashboard from '../components/ui/TaskDashboard';

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/tasks`, {
    cache: 'no-store',
  });
  const tasks = await res.json();

  return (
    <div>
      <TaskDashboard initialTasks={tasks} />
    </div>
  );
}
