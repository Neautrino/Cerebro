'use client';

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { TagInput } from '@/components/shared/TagsInput';
import { Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from 'convex/react';
import UploadingBtn from '@/components/shared/UploadingBtn';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';


const formSchema = z.object({
  title: z.string({
    required_error: 'Title is required'
  }),
  content: z.string(),
  tags: z.array(z.string()).optional()
})

export default function AddNotesBtn() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      tags: []
    },
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const createNote = useMutation(api.notes.createNote);
  const createUniqueTags = useMutation(api.tags.createUniqueTags);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const uniqueTags = Array.from(new Set(values.tags || []));
    
    await createNote({ 
      title: values.title, 
      content: values.content,
      tags: uniqueTags,
    });
    await createUniqueTags({ names: uniqueTags });
    form.reset();

    setIsDialogOpen(false);
  }
  return (
    <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter entry title..."
                      {...field}
                      required
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="content">Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your content here..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>

              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagInput value={field.value || []} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <UploadingBtn isLoading={form.formState.isSubmitting} loadingText='Creating...'>
              Create Entry
            </UploadingBtn>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}