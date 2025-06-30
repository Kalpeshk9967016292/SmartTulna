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
                    <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">The Community-Powered Product Comparison Tool.</h1>
                    <p className="text-lg md:text-xl text-muted-foreground">Stop wasting time on data entry. Find products added by the community, or be the first to contribute. Track public online prices alongside your private local quotes to make the smartest decision.</p>
                    <Button asChild size="lg" className="text-lg">
                        <Link href={user ? "/dashboard" : "/login"}>
                            Get Started - It's Free
                        </Link>
                    </Button>
                </div>
                <div className='hidden md:block'>
                    <Image 
                        src="https://storage.googleapis.com/project-spark-b6b02.appspot.com/static/29ce459a-58b2-4d2c-81b4-7b79a554a72d" 
                        alt="Illustration of people comparing products online" 
                        width={600} 
                        height={400} 
                        className="rounded-lg shadow-xl" 
                        data-ai-hint="online shopping" 
                    />
                </div>
            </div>
        </section>
    );
}
