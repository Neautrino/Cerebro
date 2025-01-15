'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function NotesGrid() {

  const notes = useQuery(api.notes.getNotes);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {notes?.map((note) => (
        <Card key={note._id} className="hover:bg-accent/50 transition-colors cursor-pointer h-54 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl truncate">{note.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden flex flex-col justify-between">
            <p className="text-muted-foreground mb-4 line-clamp-2">{note.content}</p>
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