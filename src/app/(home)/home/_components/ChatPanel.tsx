import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

function ChatPanel() {

    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');

    const handleSendMessage = () => {
        if (!currentMessage.trim()) return;

        setMessages([...messages, { role: 'user', content: currentMessage }]);

        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'I understand you\'re asking about ' + currentMessage + '. Let me help you with that...'
            }]);
        }, 1000);
        setCurrentMessage('');
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5" />
                    <CardTitle>Chat with AI Assistant</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                    Ask questions about your knowledge base and get intelligent answers
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-4 h-[400px] overflow-y-auto border rounded-lg p-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                    }`}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex space-x-2">
                    <Input
                        placeholder="Ask a question..."
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default ChatPanel