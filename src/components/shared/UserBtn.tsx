'use client'

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"
import { SignInButton, UserButton } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"

export default function UserBtn() {
    return (
        <div className="flex items-center space-x-4">
            <Unauthenticated>
                    <SignInButton />
                </Unauthenticated>
                <Authenticated>
                    <UserButton />
                </Authenticated>
                <AuthLoading>
                    <Loader2 className="animate-spin" />
                </AuthLoading>
        </div>
    )
}