'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}


export function TagInput({ value, onChange }: TagInputProps) {
  const [input, setInput] = useState('');
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const existingTags = useQuery(api.tags.getAllTags);

  useEffect(() => {
    if (existingTags) {
      setFilteredTags(
        existingTags.filter(tag => 
          !value.includes(tag.name) && 
          tag["name"].toLowerCase().includes(input.toLowerCase())
        ).map(tag => tag.name)
      );
    }
  }, [input, value, existingTags]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input) {
      e.preventDefault();
      const newTag = input.toLowerCase().trim();
      if (!value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInput('');
    }
  };

  const addExistingTag = (tag: string) => {
    if (!value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-md">
        {value.map(tag => (
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
          placeholder={value.length === 0 ? "Add tags by clicking Enter..." : ""}
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