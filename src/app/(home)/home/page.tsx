'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, FileText, Video, Link2, Twitter, FileIcon, Send, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const knowledgeItems = [
  {
    id: 1,
    title: 'Getting Started with Next.js 13',
    type: 'note',
    excerpt: 'A comprehensive guide to the latest features in Next.js 13...',
    tags: ['nextjs', 'react', 'development'],
    date: '2024-03-25',
    icon: FileText,
  },
  {
    id: 2,
    title: 'System Architecture Documentation',
    type: 'document',
    excerpt: 'Technical documentation for the new system architecture...',
    tags: ['architecture', 'technical'],
    date: '2024-03-24',
    icon: FileIcon,
  },
  {
    id: 3,
    title: 'Advanced React Patterns',
    type: 'video',
    excerpt: 'Learn advanced React patterns and best practices...',
    tags: ['react', 'advanced'],
    date: '2024-03-23',
    icon: Video,
  },
  {
    id: 4,
    title: 'UI/UX Design Principles',
    type: 'link',
    excerpt: 'Essential principles for modern UI/UX design...',
    tags: ['design', 'ui', 'ux'],
    date: '2024-03-22',
    icon: Link2,
  },
  {
    id: 5,
    title: 'Web Performance Tips',
    type: 'tweet',
    excerpt: 'Thread on improving web application performance...',
    tags: ['performance', 'web'],
    date: '2024-03-21',
    icon: Twitter,
  },
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');

  const filteredItems = knowledgeItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    setMessages([...messages, { role: 'user', content: currentMessage }]);
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I understand you\'re asking about ' + currentMessage + '. Let me help you with that...'
      }]);
    }, 1000);
    setCurrentMessage('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Knowledge Base</h2>
        <p className="text-muted-foreground">All your knowledge in one place</p>
      </div>

      <Tabs defaultValue="browse">
        <TabsList>
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="ai">Ask AI</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search knowledge base..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded bg-accent flex items-center justify-center">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Added: {item.date}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{item.excerpt}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{item.type}</Badge>
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
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
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
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
        </TabsContent>
      </Tabs>
    </div>
  );
}