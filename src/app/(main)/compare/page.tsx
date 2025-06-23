import { ComparisonTable } from "@/components/compare/comparison-table";

export default function ComparePage() {
  return (
    <div className="container mx-auto py-8">
       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Product Comparison</h1>
          <p className="text-muted-foreground">Side-by-side comparison of your selected products.</p>
        </div>
      </div>
      <ComparisonTable />
    </div>
  );
}
