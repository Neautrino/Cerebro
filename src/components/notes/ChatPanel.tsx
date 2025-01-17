import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useAction } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'

function ChatPanel({ noteId }: { noteId: Id<"notes"> }) {

    const [message, setMessage] = useState("");

    const askQuestion = useAction(api.notes.askQuestion);

    return (
        <div className='w-[300px] h-[450px] bg-gray-900 rounded-lg flex flex-col justify-between'>
            <ScrollArea className='max-h-[400px] overflow-y-auto'>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
            </ScrollArea>
            <div className="flex w-full max-w-sm items-center space-x-2">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    askQuestion({ question: message, noteId });
                }}>
                <Input value={message} type="text" placeholder="Chat with AI..." onChange={(e) => setMessage(e.target.value)} />
                <Button type="submit">Send</Button>
                </form>
            </div>
        </div>
    )
}

export default ChatPanel