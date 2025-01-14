import Navbar from "@/components/shared/Navbar";
import Sidebar from "@/components/shared/Sidebar";
import React from "react";

export default function HomeLayout({
    children
}: {
    children: React.ReactNode;
}){
    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="flex">
                <div className="w-64 border-r-2 min-h-[calc(100vh-4rem)]">
                    <Sidebar />
                </div>
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}