'use client';

import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { dark} from '@clerk/themes'
import React from 'react'
import { useTheme } from 'next-themes'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

function ClerkWithTheme({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();
    
    return (
        <ClerkProvider
            appearance={{
                baseTheme: theme === 'dark' ? dark : undefined,
                layout: {
                    unsafe_disableDevelopmentModeWarnings: true,
                },
            }}
            
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
        >
            {children}
        </ClerkProvider>
    );
}

function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <ClerkWithTheme>
                <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                    {children}
                </ConvexProviderWithClerk>
            </ClerkWithTheme>
        </ThemeProvider>
    )
}

export default Providers