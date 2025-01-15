import { 
    Brain, 
    Link, 
    Calendar, 
    Search,
    Sparkles,
    Share2
  } from 'lucide-react';
  
  const features = [
    {
      name: 'Smart Note-Taking',
      description: 'Create rich, interconnected notes with our powerful editor.',
      icon: Brain,
    },
    {
      name: 'Concept Linking',
      description: 'Connect ideas naturally with visual mind-mapping.',
      icon: Link,
    },
    {
      name: 'Calendar Integration',
      description: 'Sync with your schedule for seamless task management.',
      icon: Calendar,
    },
    {
      name: 'Intelligent Search',
      description: 'Find anything instantly with smart suggestions.',
      icon: Search,
    },
    {
      name: 'AI Insights',
      description: 'Get AI-powered suggestions and priority analysis.',
      icon: Sparkles,
    },
    {
      name: 'Collaboration',
      description: 'Share and collaborate on ideas with your team.',
      icon: Share2,
    },
  ];
  
  export function Features() {
    return (
      <div className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">
              Supercharge Your Productivity
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to organize your thoughts
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Transform the way you think, work, and create with our comprehensive suite of tools designed to extend your mental capabilities.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold">
                    <feature.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    );
  }