'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';

const tasks = [
  { id: 1, title: 'Research market trends', completed: false, priority: 'high', dueDate: '2024-03-25' },
  { id: 2, title: 'Write project proposal', completed: false, priority: 'medium', dueDate: '2024-03-26' },
  { id: 3, title: 'Review team feedback', completed: true, priority: 'low', dueDate: '2024-03-24' },
];

export function TaskList({ filter }: { filter: string }) {
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'today') return task.dueDate === '2024-03-24';
    if (filter === 'upcoming') return new Date(task.dueDate) > new Date();
    return true;
  });

  return (
    <div className="space-y-4">
      {filteredTasks.map((task) => (
        <Card key={task.id}>
          <CardContent className="flex items-center p-4">
            <Checkbox checked={task.completed} className="mr-4" />
            <div className="flex-1">
              <p className={task.completed ? 'line-through text-muted-foreground' : ''}>
                {task.title}
              </p>
              <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
            </div>
            <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
              {task.priority}
            </Badge>
            <Trash2 className="ml-8 cursor-pointer h-4 w-4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}