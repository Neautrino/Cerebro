'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import NoteCard from './NoteCard';
import NotesSkeleton from './NotesSkeleton';
import Illustration from '@/components/shared/Illustration';

export default function NotesGrid() {

  const notes = useQuery(api.notes.getNotes);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

      {notes === undefined ? (
        Array.from({ length: 6 }).map((_, index) => (
          <NotesSkeleton key={index} />
        ))
      ) : (notes.length > 0 ? notes.map((note) => (
        <NoteCard note={note} key={note._id} />
      )) : (
        <Illustration link="/notes_not_found.svg" title="No notes found" description="Create a new note to get started." type="note" />
      ))}

    </div>
  );
}