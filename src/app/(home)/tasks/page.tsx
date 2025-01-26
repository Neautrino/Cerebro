'use client';

import { useState } from 'react';
import { TaskList } from './_components/TaskList';
import { TaskFilter } from './_components/TaskFilter';
import AddTaskBtn from './_components/AddTaskBtn';

export default function TasksPage() {
  const [filter, setFilter] = useState('all');
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">Manage your tasks and projects</p>
        </div>
        <AddTaskBtn />
      </div>
      
      <div className="flex gap-6">
        <div className="w-full">
          <TaskFilter currentFilter={filter} onFilterChange={setFilter} />
          <TaskList filter={filter} />
        </div>
      </div>
    </div>
  );
}