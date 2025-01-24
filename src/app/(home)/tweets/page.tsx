'use client';

import TweetCard from './_components/TweetCard';
import { api } from '../../../../convex/_generated/api';
import { useQuery } from 'convex/react';
import Illustration from '@/components/shared/Illustration';
import AddTweetsBtn from './_components/AddTweetsBtn';
import TweetsSkeleton from './_components/TweetsSkeleton';


export default function TweetsPage() {

  const tweets = useQuery(api.tweets.getTweets);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tweets</h2>
          <p className="text-muted-foreground">Save and organize important tweets</p>
        </div>
        <AddTweetsBtn />
      </div>

      <div className="grid gap-4">
        {tweets === undefined && <TweetsSkeleton />}
        {tweets && tweets.length > 0 ? (tweets.map((tweet) => (
          <TweetCard key={tweet._id} tweet={tweet} />
        ))) : (
          <Illustration
            link="/tweets_not_found.svg"
            title="No tweets found"
            description="You haven't saved any tweets yet. Click the button to add your first tweet."
            type="tweets"
          />
        )}
      </div>
    </div>
  );
}