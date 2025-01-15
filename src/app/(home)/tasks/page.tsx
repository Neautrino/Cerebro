'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CheckSquare } from 'lucide-react';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskFilter } from '@/components/tasks/TaskFilter';

export default function TasksPage() {
  const [filter, setFilter] = useState('all');
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">Manage your tasks and projects</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
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