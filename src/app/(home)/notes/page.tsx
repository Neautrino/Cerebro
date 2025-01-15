'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AddNotesBtn from '@/components/notes/AddNotesBtn';
// import { KnowledgeGrid } from '@/components/workspace/knowledge/knowledge-grid';

export default function NotesPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notes</h2>
          <p className="text-muted-foreground">Your personal wiki & notes in one place</p>
        </div>
        <AddNotesBtn  />
      </div>

      {/* <KnowledgeGrid /> */}
    </div>
  );
}