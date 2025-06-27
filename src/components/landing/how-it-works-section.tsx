import { Card, CardContent } from "@/components/ui/card";

const steps = [
    {
        step: 1,
        title: "Add a Product",
        description: "Enter the product name and model. Add specific attributes you care about, like 'Screen Size' or 'Warranty'."
    },
    {
        step: 2,
        title: "Add Sellers & Prices",
        description: "Log prices from online links or quotes from local shops. You can mark each seller as 'Online' or 'Local'."
    },
    {
        step: 3,
        title: "Compare & Decide",
        description: "View your products in a clean, side-by-side table or a visual chart to find the best deal and make the smartest choice."
    }
]

export function HowItWorksSection() {
    return (
        <section className="py-20 md:py-24 bg-secondary/30">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Get Started in 3 Simple Steps</h2>
                    <p className="text-lg text-muted-foreground mt-2">From search to decision in minutes.</p>
                </div>
                <div className="relative grid md:grid-cols-3 gap-8">
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
                    {steps.map((step) => (
                        <Card key={step.step} className="relative bg-background">
                            <CardContent className="p-6 text-center">
                                <div className="mb-4 inline-flex h-16 w-16 rounded-full bg-primary text-primary-foreground items-center justify-center text-2xl font-bold ring-8 ring-background">
                                    {step.step}
                                </div>
                                <h3 className="text-xl font-headline font-semibold mb-2">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
