"use client";

import { ArrowLeftToLineIcon, ArrowRightToLineIcon, CheckSquare, FileIcon, FileText, FolderKanban, HomeIcon, Link2, Settings, Twitter, Video } from 'lucide-react';
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Separator } from '../ui/separator';


const sidebarItems = [
    { id: 0, icon: HomeIcon, label: 'Home', href: '/home' },
    { id: 1, icon: FileText, label: 'Notes', href: '/notes' },
    { id: 2, icon: CheckSquare, label: 'Tasks', href: '/tasks' },
    { id: 4, icon: FileIcon, label: 'Documents', href: '/documents' },
    { id: 5, icon: Video, label: 'Videos', href: '/videos' },
    { id: 6, icon: Link2, label: 'Links', href: '/links' },
    { id: 7, icon: Twitter, label: 'Tweets', href: '/tweets' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
        <div className={`${isCollapsed ? "w-20" : "w-64"} border-r-2 transition-all duration-300 h-full flex flex-col`}>
            <div className="flex-1 overflow-hidden">
                <div className="h-full flex flex-col relative py-4">
                    <div className="px-4 py-2 flex items-center gap-4">
                        {isCollapsed ? (
                            <Button
                                variant="outline"
                                onClick={() => setIsCollapsed(false)}
                            >
                                <ArrowRightToLineIcon className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={() => setIsCollapsed(true)}
                            >
                                <ArrowLeftToLineIcon className="h-4 w-4" />
                            </Button>
                        )}
                        {!isCollapsed && (
                            <div>
                                <h2 className="text-lg font-semibold">Welcome</h2>
                                <p className='text-[10px] text-gray-400'>Don't Overload your brain.</p>
                            </div>
                        )}
                    </div>
                    <div className="px-3 flex-1">
                        {sidebarItems.map((item) => (
                            <React.Fragment key={item.id}>
                                {item.id === 4 && <Separator className="my-2" />}
                                <Link href={item.href}>
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "w-full justify-start my-1",
                                            pathname === item.href && "bg-accent"
                                        )}
                                    >
                                        <item.icon className="mr-2 h-4 w-4" />
                                        {!isCollapsed && item.label}
                                    </Button>
                                </Link>
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="px-3 w-full pr-6">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="w-full justify-start">
                                <FolderKanban className="mr-2 h-4 w-4" />
                                {!isCollapsed && "Dashboard"}
                            </Button>
                        </Link>
                        <Link href="/settings">
                            <Button variant="ghost" className="w-full justify-start">
                                <Settings className="mr-2 h-4 w-4" />
                                {!isCollapsed && "Settings"}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}