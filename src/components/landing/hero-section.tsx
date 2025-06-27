'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import Image from 'next/image';

export function HeroSection() {
    const { user } = useAuth();
    return (
        <section className="py-20 md:py-32 bg-secondary/30">
            <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">The Smartest Way to Compare Products.</h1>
                    <p className="text-lg md:text-xl text-muted-foreground">Stop guessing. Start comparing. SmartTulna gives you the power to compare any two products on your own terms, tracking prices from both online and local sellers.</p>
                    <Button asChild size="lg" className="text-lg">
                        <Link href={user ? "/dashboard" : "/login"}>
                            Get Started - It's Free
                        </Link>
                    </Button>
                </div>
                <div className='hidden md:block'>
                    <Image 
                        src="https://placehold.co/600x400.png" 
                        alt="Product comparison dashboard interface" 
                        width={600} 
                        height={400} 
                        className="rounded-lg shadow-xl" 
                        data-ai-hint="product comparison dashboard" 
                    />
                </div>
            </div>
        </section>
    );
}
