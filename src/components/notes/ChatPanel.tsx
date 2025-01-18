import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useAction } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import { cn } from '@/lib/utils'

interface MessagesProp {
    id: number;
    message: string;
    from: string;
}

function ChatPanel({ noteId }: { noteId: Id<"notes"> }) {

    const [messages, setMessages] = useState<MessagesProp[]>([]);
    const [ newMessage, setNewMessage ] = useState('');
    const lastRef = useRef<HTMLDivElement>(null);

    const askQuestion = useAction(api.notes.askQuestion);

    useEffect(() => {
        lastRef.current?.scrollIntoView({ behavior: 'smooth' });
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        setMessages(prevMessages => [
            ...prevMessages,
            { id: prevMessages.length + 1, message: newMessage, from: 'user' }
        ]);
        setNewMessage('');
    
        const response = await askQuestion({ question: newMessage, noteId });
    
        setMessages(prevMessages => [
            ...prevMessages,
            { id: prevMessages.length + 1, message: response, from: 'bot' }
        ]);
    }

    return (
        <div className='w-full h-[500px] bg-gray-900 rounded-lg flex flex-col justify-between'>
            <div className='px-4 overflow-y-scroll m-4 flex flex-col gap-4 w-full'>
               {messages.map((msg) => (
                    <div key={msg.id} className={cn('p-4 rounded-lg', msg.from === 'bot' ? 'bg-gray-800' : 'text-right')}>
                        {msg.message}
                    </div>
                ))}
                <div ref={lastRef}></div>
            </div>
            <div className="w-full ">
                <form onSubmit={handleSubmit}
                    className='flex w-full items-center space-x-2'
                >
                    <Input value={newMessage} className="w-full p-4 h-12" type="text" placeholder="Chat with AI..." onChange={(e) => setNewMessage(e.target.value)} />
                    <Button type="submit" >Send</Button>
                </form>
            </div>
        </div>
    )
}

export default ChatPanel