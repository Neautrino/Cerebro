import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function DocumentDetailSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-4">
                <Skeleton className="h-6 w-6" />
                <div className="space-y-4 flex-1 pl-2">
                    <Skeleton className="h-10 w-3/4" />
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                </div>
                <div className="space-x-2 flex ">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                </div>
            </div>

            <div className="p-4">
                <Skeleton className="min-h-[200px] w-full" />
            </div>
            <div>
                <Skeleton className="h-8 w-1/6" />
            </div>
            <div>
                <Skeleton className='w-full h-[500px]' />
            </div>
        </div>
    )
}
