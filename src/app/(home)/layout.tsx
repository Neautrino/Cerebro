import Navbar from "@/components/shared/Navbar";
import Sidebar from "@/components/shared/Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

export default function HomeLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-8">
                    <ScrollArea>

                    {children}
                    </ScrollArea>
                </main>
            </div>
        </div>
    )
}