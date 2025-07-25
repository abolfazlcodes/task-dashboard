import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Task } from '@/types';

const dbPath = path.join(process.cwd(), 'src/db/db.json');

async function readTasks(): Promise<Task[]> {
  const data = await fs.readFile(dbPath, 'utf-8');
  const parsed = JSON.parse(data);
  return Array.isArray(parsed.tasks) ? parsed.tasks : [];
}

async function writeTasks(tasks: Task[]): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify({ tasks }, null, 2));
}

export async function GET(_req: NextRequest) {
  try {
    const tasks = await readTasks();
    return NextResponse.json(tasks);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: Task = await req.json();
    const tasks = await readTasks();
    tasks.push(body);
    await writeTasks(tasks);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: Task = await req.json();
    let tasks = await readTasks();
    tasks = tasks.map((t) => (t.id === body.id ? { ...t, ...body } : t));
    await writeTasks(tasks);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body: { id: string } = await req.json();
    let tasks = await readTasks();
    tasks = tasks.filter((t) => t.id !== body.id);
    await writeTasks(tasks);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}
