"use client";

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function Onboarding() {

    const router = useRouter();

    function handlePageDown() {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    }

    function handleOnboarding() {
        router.push('/home');
    }

    return (
        <div className="flex items-center justify-center gap-x-6">
            <Button size="lg" onClick={handleOnboarding}>Get Started</Button>
            <Button variant="outline" size="lg" onClick={handlePageDown}>Learn More</Button>
        </div>
    )

}

export default Onboarding