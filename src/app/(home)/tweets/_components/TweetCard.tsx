'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Twitter, Trash2Icon, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Id } from '../../../../../convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';

interface Tweet {
  _id: Id<"tweets">;
  userId: string;
  title: string;
  author?: string;
  content: string;
  url: string;
  updatedTime: number;
  tags?: string[] | undefined;
}

function TweetCard({ tweet }: { tweet: Tweet }) {

  const deleteTweet = useMutation(api.tweets.deleteTweet);
  return (
    <Card key={tweet._id}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
              <Twitter className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <CardTitle className="text-base">{tweet.title || "Untitled"}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">@ {tweet.author || "Unknown"}</CardDescription>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <a href={tweet.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          <Button variant="ghost" onClick={() => {
            deleteTweet({ id: tweet._id });
          }}>
            <Trash2Icon className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-base mb-4 text-muted-foreground line-clamp-2">{tweet.content}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground ">
          <div className="flex space-x-4">
            {tweet.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <span>{new Date(tweet.updatedTime).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default TweetCard