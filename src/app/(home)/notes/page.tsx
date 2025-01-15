'use client';

import AddNotesBtn from '@/components/notes/AddNotesBtn';
import NotesGrid from '@/components/notes/NotesGrid';

export default function NotesPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notes</h2>
          <p className="text-muted-foreground text-[10px] sm:text-base trim sm:block">Your personal wiki & notes in one place</p>
        </div>
        <AddNotesBtn />
      </div>
      <NotesGrid />
    </div>
  );
}