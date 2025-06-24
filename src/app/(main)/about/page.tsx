import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about SmartTulna, our mission to simplify product comparison, and the team behind this innovative tool.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-4xl font-bold font-headline text-primary">About SmartTulna</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Empowering you to make smarter, more informed decisions.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-lg">
            <p>
              In a world flooded with options, making the right choice can be overwhelming. SmartTulna was born from a simple idea: what if you could compare any two products, side-by-side, based on the criteria that matter most to *you*? Not just the manufacturer's specs, but real-world prices from different sellers, both online and local.
            </p>
            <p>
              Our mission is to cut through the noise and provide a clear, unbiased comparison platform. We empower you to track prices, compare features, and ultimately find the best value for your money. Whether you're comparing smartphones, washing machines, or laptops, SmartTulna is your personal guide to intelligent shopping.
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Why SmartTulna?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <p>
                    <strong>Total Control:</strong> You decide what products to compare and what attributes are important. No sponsored placements, no confusing jargon.
                </p>
                <p>
                    <strong>Local & Online:</strong> We bridge the gap between e-commerce and local stores. Track prices from your favorite online retailer alongside a quote from your neighborhood shop.
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
