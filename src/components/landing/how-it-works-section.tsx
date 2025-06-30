import { Card, CardContent } from "@/components/ui/card";

const steps = [
    {
        step: 1,
        title: "Find or Add a Product",
        description: "Enter a model number. If it's in our public database, we'll pre-fill the details. If not, you can add it and help the next person."
    },
    {
        step: 2,
        title: "Add Your Private Prices",
        description: "The community helps maintain online seller links. You just add your private quotes from local shops—this data is only visible to you."
    },
    {
        step: 3,
        title: "Compare & Decide",
        description: "View your products side-by-side. Compare community-sourced online prices with your local quotes to find the best deal."
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
