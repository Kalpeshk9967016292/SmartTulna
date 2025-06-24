import { ProductList } from "@/components/dashboard/product-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage and compare your saved products.",
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <ProductList />
    </div>
  );
}
