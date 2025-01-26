'use client';

import { Button } from '@/components/ui/button';

const filters = [
  { id: 'all', label: 'All Tasks' },
  { id: 'today', label: 'Today' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
];

export function TaskFilter({ 
  currentFilter, 
  onFilterChange 
}: { 
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}) {
  return (
    <div className="flex gap-2 mb-6">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={currentFilter === filter.id ? 'default' : 'outline'}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}