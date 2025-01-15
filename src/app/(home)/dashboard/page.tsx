'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, FileText, Link as LinkIcon, CheckSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Note = {
  id: string;
  content: string;
  createdAt: number;
}

type Task = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}
const stats = [
  { label: 'Total Notes', value: '24', icon: FileText },
  { label: 'Connected Ideas', value: '12', icon: LinkIcon },
  { label: 'Tasks', value: '8', icon: CheckSquare },
];

export default function DashboardPage() {

  const [notes, setNotes] = useState<Note[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    // Simulating data fetch
    setNotes([
      { id: '1', content: 'Project Ideas', createdAt: Date.now() - 7200000 },
      { id: '2', content: 'Meeting Summary', createdAt: Date.now() - 172800000 },
    ])
    setTasks([
      { id: '4', text: 'Complete project proposal', completed: false, createdAt: Date.now() - 3600000 },
      { id: '5', text: 'Review team updates', completed: true, createdAt: Date.now() - 86400000 },
      { id: '6', text: 'Prepare for client meeting', completed: false, createdAt: Date.now() - 259200000 },
    ])
  }, [])

  const recentActivity = [...notes, ...tasks]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your second brain activity
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <ul className="space-y-4">
          {recentActivity.map((item) => (
            <li key={item.id} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium">
                  {'content' in item ? `New note: ${item.content.slice(0, 50)}...` : `New task: ${item.text}`}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/workspace">
                  View <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}