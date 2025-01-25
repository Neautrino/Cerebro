import { Brain } from 'lucide-react';
import Onboarding from './Onboarding';

export function Hero() {

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
          <Onboarding />
        </div>
      </div>
    </div>
  );
}