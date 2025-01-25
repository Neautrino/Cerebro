'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAction } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

const formSchema = z.object({
    search: z.string()
})

function SearchBar() {

    const searchAllRecords = useAction(api.search.searchAllRecords);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            search: ''
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values.search);
        form.reset();
        const results = await searchAllRecords({ search: values.search });
        console.log(results);
    }

    // useEffect(() => {
    //     async function fetchDataOnMount() {
    //         const results = await searchAllRecords({ search: '' });
    //         setRecords(results);
    //     }
    //     fetchDataOnMount();
    // }, []);

    return (
        <div className="relative flex-1 max-w-2xl mr-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="search"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        className="pl-14 md:text-xl h-16"
                                        placeholder="Search your knowledge base with vector search..."
                                        {...field}
                                        required
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="absolute right-3 top-1/2 h-10 w-10 -translate-y-1/2">
                        <Search className="h-6 w-6" />
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default SearchBar;