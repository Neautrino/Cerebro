'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';

// Simulated existing tags - in a real app, this would come from your backend
const existingTags = [
  'development', 'design', 'research', 'productivity',
  'ideas', 'projects', 'tasks', 'notes', 'meetings',
  'planning', 'goals', 'review', 'important', 'archive'
];

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState('');
  const [filteredTags, setFilteredTags] = useState<string[]>([]);

  useEffect(() => {
    setFilteredTags(
      existingTags.filter(tag => 
        !tags.includes(tag) && 
        tag.toLowerCase().includes(input.toLowerCase())
      )
    );
  }, [input, tags]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input) {
      e.preventDefault();
      const newTag = input.toLowerCase().trim();
      if (!tags.includes(newTag)) {
        existingTags.push(newTag);
        onChange([...tags, newTag]);
      }
      setInput('');
    }
  };

  const addExistingTag = (tag: string) => {
    if (!tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInput('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-md">
        {tags.map(tag => (
          <Badge key={tag} variant="secondary" className="gap-1">
            {tag}
            <X
              className="h-3 w-3 cursor-pointer hover:text-destructive"
              onClick={() => removeTag(tag)}
            />
          </Badge>
        ))}
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border-0 w-20 grow focus-visible:ring-0 p-0"
          placeholder={tags.length === 0 ? "Add tags by clicking Enter..." : ""}
        />
      </div>
      
      {input && filteredTags.length > 0 && (
        <ScrollArea className="h-32 rounded-md border">
          <div className="p-2 space-y-1">
            {filteredTags.map(tag => (
              <Badge
                key={tag}
                variant="outline"
                className="w-full justify-start cursor-pointer hover:bg-accent"
                onClick={() => addExistingTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}