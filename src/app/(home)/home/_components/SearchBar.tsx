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


const formSchema = z.object({
    search: z.string()
})

function SearchBar({ setRecords }: { setRecords: (records: typeof api.search.searchAllRecords._returnType) => void }) {

    const searchAllRecords = useAction(api.search.searchAllRecords);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            search: ''
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
       const results = await searchAllRecords({ search: values.search });
       console.log(results);
       form.reset();
       setRecords(results);
    }

    useEffect(() => {
        async function fetchDataOnMount() {
            const results = await searchAllRecords({ search: '' });
            setRecords(results);
        }
        fetchDataOnMount();
    }, []);

    return (
        <div className="relative flex-1 max-w-2xl mr-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="search"
                        render={({ field }) => (
                            <FormItem>
                                <Search className="absolute left-3 top-1/2 h-6 w-6 text-muted-foreground -translate-y-1/4" />
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
                </form>
            </Form>
        </div>
    )
}

export default SearchBar;