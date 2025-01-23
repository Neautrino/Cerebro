'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Video, Link2, Twitter, FileIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchBar from './_components/SearchBar';
import ChatPanel from './_components/ChatPanel';
import { api } from '../../../../convex/_generated/api';
import { useAction } from 'convex/react';
import { useState } from 'react';
import NotesSkeleton from '../notes/_components/NotesSkeleton';

const knowledgeItems = [
  {
    id: 1,
    title: 'Getting Started with Next.js 13',
    type: 'note',
    excerpt: 'A comprehensive guide to the latest features in Next.js 13...',
    tags: ['nextjs', 'react', 'development'],
    date: '2024-03-25',
    icon: FileText,
  },
  {
    id: 2,
    title: 'System Architecture Documentation',
    type: 'document',
    excerpt: 'Technical documentation for the new system architecture...',
    tags: ['architecture', 'technical'],
    date: '2024-03-24',
    icon: FileIcon,
  },
  {
    id: 3,
    title: 'Advanced React Patterns',
    type: 'video',
    excerpt: 'Learn advanced React patterns and best practices...',
    tags: ['react', 'advanced'],
    date: '2024-03-23',
    icon: Video,
  },
  {
    id: 4,
    title: 'UI/UX Design Principles',
    type: 'link',
    excerpt: 'Essential principles for modern UI/UX design...',
    tags: ['design', 'ui', 'ux'],
    date: '2024-03-22',
    icon: Link2,
  },
  {
    id: 5,
    title: 'Web Performance Tips',
    type: 'tweet',
    excerpt: 'Thread on improving web application performance...',
    tags: ['performance', 'web'],
    date: '2024-03-21',
    icon: Twitter,
  },
];

const getIcon = (type: string): React.ReactNode => {
  switch (type) {
    case 'note': return <FileText className="h-5 w-5" />;
    case 'document': return <FileIcon className="h-5 w-5" />;
    case 'video': return <Video className="h-5 w-5" />;
    case 'link': return <Link2 className="h-5 w-5" />;
    case 'tweet': return <Twitter className="h-5 w-5" />;
    default: return <FileText className="h-5 w-5" />;
  }
}

export default function KnowledgeBasePage() {

  const [results, setResults] = useState<typeof api.search.searchAllRecords._returnType>([]);
  console.log(results);

  return (
    <div className="space-y-8">
      <div className="flex gap-4 justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Knowledge Base</h2>
          <p className="text-muted-foreground">All your knowledge in one place</p>
        </div>
        <SearchBar setRecords={setResults} />
      </div>

      <Tabs defaultValue="browse">
        <TabsList>
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="ai">Ask AI</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 mt-8">
            {results === undefined && Array.from({ length: 4 }).map((_, index) => (
              <NotesSkeleton key={index} />
            ))}
            {results.length > 0 ? (results.map((item) => (
              <Card key={item.data._id} className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded bg-accent flex items-center justify-center">
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{item.data.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Added: {new Date(item.data.updatedTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {('content' in item.data ? item.data.content : 'description' in item.data ? item.data.description : '')?.slice(0, 100)}...
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{item.type}</Badge>
                    {item.data.tags?.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))) : (
              <NotesSkeleton />
            )}
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <ChatPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}