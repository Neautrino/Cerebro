import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

function TaskSkeleton() {
    return (
        <div className="flex justify-between py-8 px-6 border rounded-md">
            <div className='flex gap-4'>
                    <Skeleton className="h-6 w-6 rounded-md" />
                <div className="flex flex-col space-y-2">
                    <Skeleton className="h-5 w-[300px]" />
                    <Skeleton className="h-3 w-[150px]" />
                </div>
            </div>
            <div className='flex gap-8 justify-center items-center'>
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-6 rounded-md" />
            </div>
        </div>
    )
}

export default TaskSkeleton;