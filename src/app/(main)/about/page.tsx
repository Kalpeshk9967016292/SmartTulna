import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about SmartTulna, our mission to build a community-powered product comparison tool, and the team behind it.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-4xl font-bold font-headline text-primary">About SmartTulna</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Building a better way to compare, together.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-lg">
            <p>
              In a world flooded with options, making the right choice is overwhelming. What if we could pool our collective knowledge to make it easier for everyone? SmartTulna was born from this simple idea: a shared, public database of product information, built by the community, for the community.
            </p>
            <p>
              Our mission is to centralize product specifications and online prices, cutting through marketing jargon and sponsored content. By contributing and using this shared data, everyone can make smarter, faster, and more informed purchasing decisions. Your local price quotes, however, always remain private to you.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Why SmartTulna?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <p>
                    <strong>Community-Powered:</strong> Benefit from a growing database of products added by users like you. When you add a product, you help everyone. When you look one up, you benefit from the community's work.
                </p>
                <p>
                    <strong>Public & Private, Separated:</strong> We clearly separate public data (specs, online prices) from your private data (local quotes). Compare openly available information alongside your confidential prices, all in one place.
                </p>
                <p>
                    <strong>Price Over Time:</strong> (Coming Soon!) Our future price tracking feature will help you decide the best time to buy, saving you even more.
                </p>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-center">The Creators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-center items-center gap-12 text-center">
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold">I am Tiksha</h3>
                    <p className="text-muted-foreground">Co-Creator & Developer</p>
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold">NicSync</h3>
                    <p className="text-muted-foreground">Co-Creator & Developer</p>
                </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
