"use client";

import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Hero() {
  const router = useRouter();

  function handlePageDown() {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  }

  function handleOnboarding() {
    router.push('/notes');
  }

  return (
    <div className="relative isolate px-6 pt-6 lg:px-8">
      <div className="mx-auto max-w-2xl py-20 sm:py-22 lg:py-24">
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <Brain className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-8">
            Your Second Brain for
            <span className="text-primary"> Better Thinking</span>
          </h1>
          <p className="text-lg leading-8 text-muted-foreground mb-8">
            Transform your ideas into actionable knowledge. Connect thoughts, manage tasks, and leverage AI insights to boost your productivity.
          </p>
          <div className="flex items-center justify-center gap-x-6">
            <Button size="lg" onClick={handleOnboarding}>Get Started</Button>
            <Button variant="outline" size="lg" onClick={handlePageDown}>Learn More</Button>
          </div>
        </div>
      </div>
    </div>
  );
}