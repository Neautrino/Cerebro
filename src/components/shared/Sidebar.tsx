"use client";

import {  ArrowLeftToLineIcon, ArrowRightToLineIcon, CheckSquare, FileText, FolderKanban, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

function Sidebar() {

    const pathname = usePathname();

    const sidebarItems = [
        { icon: FileText, label: 'Notes', href: '/notes' },
        { icon: CheckSquare, label: 'Tasks', href: '/tasks' },
        { icon: FolderKanban, label: 'Dashboard', href: '/dashboard' },
    ];

    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
        <div className={`${isCollapsed ? "w-20" : "w-64"} border-r-2 transition-all duration-300`}>
            <div className="h-full">
                <div className="space-y-4 h-full relative py-4">
                    <div className="px-4 py-2 flex items-center gap-4">
                        {isCollapsed ? (
                            <Button
                                variant="outline"
                                className=""
                                onClick={() => setIsCollapsed(false)}
                            >
                                <ArrowRightToLineIcon className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                className=""
                                onClick={() => setIsCollapsed(true)}
                            >
                                <ArrowLeftToLineIcon className="h-4 w-4" />
                            </Button>
                        )}
                        {isCollapsed? "" : (
                            <div>
                            <h2 className="text-lg font-semibold">Welcome</h2>
                            <p className='text-[10px] text-gray-400'>Your brain needs some rest</p>
                            </div>
                        )}
                    </div>
                    <div className="px-3">
                        {sidebarItems.map((item) => (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start my-1",
                                        pathname === item.href && "bg-accent"
                                    )}
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {isCollapsed? "" : item.label}
                                </Button>
                            </Link>
                        ))}
                    </div>
                    <div className="px-3 absolute bottom-4 w-full pr-6">
                        <Link href="/settings">
                            <Button variant="ghost" className="w-full justify-start">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Button>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Sidebar