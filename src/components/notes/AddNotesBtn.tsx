'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { TagInput } from '@/components/shared/TagsInput';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function AddNotesBtn() {
  const [title, setTitle] = useState('');
  const [ content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  const createNotes = useMutation(api.notes.createNotes);
  const createTags = useMutation(api.tags.createTags);
  
  const handleCreateNotes = async () => {
    await createNotes({title, content, tags});
    await createTags({names: tags});
    setTitle('');
    setContent('');
    setTags([]);
    
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Knowledge Entry</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter entry title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Type your content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <TagInput tags={tags} onChange={setTags} />
          </div>
          <Button onClick={handleCreateNotes} className="w-full">
            Create Entry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}