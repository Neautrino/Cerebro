'use client';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useState } from 'react';


export default function AddVideoBtn() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Video
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Video</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">Add a new video to your collection</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center justify-center p-12">
                <h2 className="text-2xl">Work In Progress</h2>
                <p className="text-lg text-muted-foreground">Stay tuned for future updates!</p>
            </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => {
                setIsDialogOpen(false);
            }}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}