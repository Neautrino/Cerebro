'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, ExternalLink, Twitter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const tweets = [
  {
    id: 1,
    author: 'TechGuru',
    handle: '@techguru',
    content: 'Just discovered an amazing new way to optimize React components. Thread incoming! 🧵',
    date: '2024-03-25',
    likes: 1234,
    retweets: 567,
    category: 'Development',
  },
  {
    id: 2,
    author: 'DesignMaster',
    handle: '@designmaster',
    content: 'Here\'s a quick tip for better UI design: Always consider the hierarchy of information when laying out your elements. 🎨',
    date: '2024-03-24',
    likes: 892,
    retweets: 245,
    category: 'Design',
  },
];

export default function TweetsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tweets</h2>
          <p className="text-muted-foreground">Save and organize important tweets</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Tweet
        </Button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search tweets..." className="pl-8" />
      </div>

      <div className="grid gap-4">
        {tweets.map((tweet) => (
          <Card key={tweet.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                    <Twitter className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{tweet.author}</CardTitle>
                    <p className="text-sm text-muted-foreground">{tweet.handle}</p>
                  </div>
                </div>
                <Badge variant="secondary">{tweet.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base mb-4">{tweet.content}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex space-x-4">
                  <span>♥ {tweet.likes}</span>
                  <span>↺ {tweet.retweets}</span>
                </div>
                <span>{tweet.date}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}