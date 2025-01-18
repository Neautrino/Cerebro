'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import Link from 'next/link';
import { Button } from '../ui/button';
import { EyeIcon } from 'lucide-react';
import NotesSkeleton from './NotesSkeleton';
import Image from 'next/image';
import AddNotesBtn from './AddNotesBtn';

export default function NotesGrid() {

  const notes = useQuery(api.notes.getNotes);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {notes === undefined &&  Array.from({ length: 6 }).map((_, index) => (
        <NotesSkeleton key={index} />
      ))}
      {notes && notes.length > 0 ? notes.map((note) => (
        <Card key={note._id} className="hover:bg-accent/50 transition-colors flex flex-col">
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
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground mt-4">
                Last updated: {new Date(note.updatedTime).toLocaleDateString()}
              </p>
              <Button variant="secondary" asChild>
                <Link href={`/notes/${note._id}`} className="flex items-center gap-2">
                  <EyeIcon className="w-4 h-4" />
                  View
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )) : (
        <div className="flex flex-col col-span-full mt-20 items-center justify-center gap-4">
          <Image 
            src="/documents_not_found.svg"
            width={200}
            height={200}
            alt="No notes found"
          />
          <p className="text-muted-foreground text-lg">
            No notes found. Create a new note to get started.
          </p>
          <AddNotesBtn />
        </div>
      )}
    </div>
  );
}