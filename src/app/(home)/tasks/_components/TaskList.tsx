'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Id } from '../../../../../convex/_generated/dataModel';
import Illustration from '@/components/shared/Illustration';
import TaskSkeleton from './TasksSkeleton';

export function TaskList({ filter }: { filter: string }) {

  const tasks = useQuery(api.tasks.getAllTasks);
  const updateCompletion = useMutation(api.tasks.updateCompletion);
  const deleteTask = useMutation(api.tasks.deleteTask);
  const filteredTasks = tasks?.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return task.dueDate >= today.getTime() && task.dueDate < tomorrow.getTime();
    }
    if (filter === 'upcoming') return task.dueDate > Date.now();
    return !task.completed;
  });

  const handleUpdateCompletion = async (id: Id<"tasks">, completed: boolean) => {
    await updateCompletion({ id, completed });
  };

  const handleDeleteTask = async (id: Id<"tasks">) => {
    await deleteTask({ id });
  };

  return (
    <div className="space-y-4">
      {filteredTasks === undefined ? (
        Array.from({ length: 3 }).map((_, index) => (
          <TaskSkeleton key={index} />
        ))
      ) :
        filteredTasks && filteredTasks.length > 0 ? (filteredTasks?.map((task) => (
          <Card key={task._id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="flex items-center p-6">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => handleUpdateCompletion(task._id, !task.completed)}
                className="mr-6 h-5 w-5"
              />
              <div className="flex-1 space-y-1">
                <p className={`text-lg font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge
                variant={task.priority === 'high' ? 'destructive' : 'secondary'}
                className="capitalize"
              >
                {task.priority}
              </Badge>
              <Button variant="ghost" size="icon" className="ml-4 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => handleDeleteTask(task._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))) : (
          <Illustration
            link="/tasks_not_found.svg"
            title="No tasks found"
            description="You haven't saved any tasks yet. Click the button to add your first task."
            type="tasks"
          />
        )}
    </div>
  );
}
