'use client';

import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import React from 'react'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);


function Providers({children}: { children: React.ReactNode }) {
    return (
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string}>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
        </ThemeProvider>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}

export default Providers