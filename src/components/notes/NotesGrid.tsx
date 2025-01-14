'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const knowledgeItems = [
  {
    id: 1,
    title: 'Web Development Best Practices',
    excerpt: 'A collection of modern web development practices and patterns...',
    tags: ['development', 'web', 'best-practices'],
    lastUpdated: '2024-03-20',
  },
  {
    id: 2,
    title: 'Project Management Framework',
    excerpt: 'Comprehensive guide to agile project management methodologies...',
    tags: ['management', 'agile', 'methodology'],
    lastUpdated: '2024-03-19',
  },
  {
    id: 3,
    title: 'Design System Guidelines',
    excerpt: 'Documentation for maintaining consistent design patterns...',
    tags: ['design', 'ui', 'guidelines'],
    lastUpdated: '2024-03-18',
  },
  {
    id: 4,
    title: 'Design System Guidelines',
    excerpt: 'Documentation for maintaining consistent design patterns...',
    tags: ['design', 'ui', 'guidelines'],
    lastUpdated: '2024-03-18',
  },
];

export default function NotesGrid() {

  const notes = useQuery(api.notes.getNotes);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {notes?.map((note) => (
        <Card key={note._id} className="hover:bg-accent/50 transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="text-xl">{note.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{note.content}</p>
            <div className="flex flex-wrap gap-2">
              {note?.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: {new Date(note.updatedTime).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}