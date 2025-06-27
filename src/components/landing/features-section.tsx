import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DatabaseZap, Scale, Store } from "lucide-react";

const features = [
    {
        icon: <Scale className="h-8 w-8 text-primary" />,
        title: "Compare Anything",
        description: "From gadgets to groceries, add any two products and see a detailed side-by-side comparison based on attributes you define."
    },
    {
        icon: <Store className="h-8 w-8 text-primary" />,
        title: "Online & Local Prices",
        description: "Bridge the gap between e-commerce and local shops. Track prices from your favorite online retailer alongside a quote from a neighborhood store."
    },
    {
        icon: <DatabaseZap className="h-8 w-8 text-primary" />,
        title: "You're in Control",
        description: "You decide what to compare. No sponsored placements, no confusing jargon. Just the data you need to make an informed decision."
    }
];

export function FeaturesSection() {
    return (
        <section className="py-20 md:py-24 bg-background">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Why Choose SmartTulna?</h2>
                    <p className="text-lg text-muted-foreground mt-2">The clear choice for savvy shoppers.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="text-center bg-secondary/30 border-0 shadow-none hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                                    {feature.icon}
                                </div>
                                <CardTitle className="font-headline pt-4">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
