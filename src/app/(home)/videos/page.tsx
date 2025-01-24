'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, ExternalLink } from 'lucide-react';
import AddVideoBtn from './_components/AddVideoBtn';

const videos = [
  {
    id: 1,
    title: 'Introduction to React Hooks',
    url: 'https://youtube.com/watch?v=example1',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80',
    source: 'YouTube',
    addedDate: '2024-03-25',
  },
  {
    id: 2,
    title: 'Advanced TypeScript Patterns',
    url: 'https://youtube.com/watch?v=example2',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80',
    source: 'YouTube',
    addedDate: '2024-03-24',
  },
];

export default function VideosPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Videos</h2>
          <p className="text-muted-foreground">Save and organize important videos</p>
        </div>
        <AddVideoBtn />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="object-cover w-full h-full"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{video.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Added: {video.addedDate}
                </span>
                <Button variant="ghost" size="icon" asChild>
                  <a href={video.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}