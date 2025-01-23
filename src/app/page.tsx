import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { ChatPanel } from "@/components/ChatPanel";

export default function Home() {

  return (
    <main className="bg-background">
      <Hero />
      <Features />
      <ChatPanel />
    </main>
  );
}
