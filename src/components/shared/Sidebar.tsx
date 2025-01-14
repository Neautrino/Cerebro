"use client";

import { CheckSquare, FileText, FolderKanban, Plus, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation'
import React from 'react'
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

    return (
        <div className="h-full">
            <div className="space-y-4 h-full relative py-4">
                <div className="px-4 py-2">
                    <Link href="/notes">
                        <Button className="w-full justify-start">
                            <Plus className="mr-2 h-4 w-4" />
                            New Note
                        </Button>
                    </Link>
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
                                {item.label}
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
    )
}

export default Sidebar