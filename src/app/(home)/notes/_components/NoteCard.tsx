import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';
import NotesSheet from './NotesSheet';

interface NoteCardProps {
    note: typeof api.notes.getNoteById._returnType;
}

function NoteCard({ note }: NoteCardProps) {

  const deleteNote = useMutation(api.notes.deleteNote);

  return (
    <Card key={note._id} className="transition-colors flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl truncate">{note.title}</CardTitle>
              <Button variant="ghost" onClick={() => {
                deleteNote({ id: note._id });
              }}>
                <Trash2Icon className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden flex flex-col justify-between">
            <p className="text-muted-foreground mb-4 line-clamp-2">{note.content}</p>
            <div className="flex flex-wrap gap-2">
              {note?.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
            <div className="flex justify-between items-center relative">
              <p className="text-sm text-muted-foreground mt-4">
                Last updated: {new Date(note.updatedTime).toLocaleDateString()}
              </p>
              <div className="static">
                <NotesSheet note={note} />
              </div>
            </div>
          </CardContent>
        </Card>
  )
}

export default NoteCard