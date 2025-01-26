'use client';

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Plus } from 'lucide-react';
import { useMutation } from 'convex/react';
import UploadingBtn from '@/components/shared/UploadingBtn';
import { api } from '../../../../../convex/_generated/api';
import { Calendar } from '@/components/ui/calendar';
import { addDays, format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


const formSchema = z.object({
    title: z.string({
        required_error: 'Title is required'
    }),
    dueDate: z.date(),
    priority: z.union([
        z.literal("low"),
        z.literal("medium"),
        z.literal("high"),
    ]),
})

export default function AddTaskBtn() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            dueDate: new Date(),
            priority: 'low',
        },
    })
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [date, setDate] = useState<Date>(new Date())
    const createTask = useMutation(api.tasks.createTask);

    const handleDateChange = (newDate: Date | undefined) => {
        if (newDate) {
            setDate(newDate);
            form.setValue('dueDate', newDate);
        }
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {

        await createTask({
            title: values.title,
            completed: false,
            dueDate: values.dueDate.getTime(),
            priority: values.priority,
        });
        form.reset();

        setIsDialogOpen(false);
    }
    return (
        <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[850px]" >
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-8 py-4">
                        {/* Left side - Task details */}
                        <div className="flex-1 space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel htmlFor="title">Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter task title..."
                                                {...field}
                                                required
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel>Due Date</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-4">
                                                <Input
                                                    {...field}
                                                    required
                                                    readOnly
                                                    value={format(field.value, "PPP")}
                                                    className="flex-1"
                                                />
                                                <div className="w-[200px]">
                                                    <Select
                                                        defaultValue="0"
                                                        onValueChange={(value) => {
                                                            const newDate = addDays(new Date(), parseInt(value));
                                                            handleDateChange(newDate);
                                                        }}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Quick Select" />
                                                        </SelectTrigger>
                                                        <SelectContent position="popper">
                                                            <SelectItem value="0">Today</SelectItem>
                                                            <SelectItem value="1">Tomorrow</SelectItem>
                                                            <SelectItem value="3">In 3 days</SelectItem>
                                                            <SelectItem value="7">In a week</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Priority Level</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-col space-y-1"
                                            >
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="high" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        High
                                                    </FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="medium" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        Medium
                                                    </FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="low" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">Low</FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <UploadingBtn isLoading={form.formState.isSubmitting} loadingText='Creating...'>
                                Create Task
                            </UploadingBtn>
                        </div>

                        {/* Right side - Calendar */}
                        <div className="border-l pl-8">
                            <div className="space-y-2">
                                <FormLabel>Select Due In Calendar</FormLabel>
                                <div className="rounded-md border">
                                    <Calendar 
                                        mode="single"
                                        selected={date}
                                        onSelect={(newDate) => handleDateChange(newDate)}
                                        disabled={(date) =>
                                            date.getTime() < new Date().setHours(0, 0, 0, 0)
                                        }
                                        initialFocus 
                                    />
                                </div>
                                <div className="text-sm text-muted-foreground text-center pt-2">
                                    Selected: {format(date, "PPP")}
                                </div>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}