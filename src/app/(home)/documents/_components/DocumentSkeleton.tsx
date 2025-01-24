import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

function DocumentSkeleton() {
    return (
        <div className="flex flex-col space-y-5 p-4 rounded-lg border">
            <div className="flex justify-between">
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-10 w-10" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-3 w-[200px]" />
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Skeleton className="h-6 w-[100px]" />
                    <Skeleton className="h-6 w-[100px]" />
                </div>
            </div>
            <div className="flex flex-col space-y-2">
                <Skeleton className="h-3 w-[70%]" />
                <Skeleton className="h-3 w-[50%]" />
            </div>
            <div className='flex justify-between'>
                <div className="flex space-x-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    )
}

export default DocumentSkeleton