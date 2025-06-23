"use client";

import { useState } from "react";
import { PlusCircle, ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";
import { ProductForm } from "./product-form";
import { mockProducts } from "@/lib/mock-data";
import type { Product } from "@/lib/types";
import { Input } from "../ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

export function ProductList() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [sortKey, setSortKey] = useState<"name" | "price" | "date">("date");
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };
  
  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === product.id ? product : p));
    } else {
      setProducts([product, ...products]);
    }
  };

  const sortedAndFilteredProducts = products
    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.model.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortKey === "price") {
        const priceA = Math.min(...a.sellers.map(s => s.price));
        const priceB = Math.min(...b.sellers.map(s => s.price));
        return priceA - priceB;
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Your Products</h1>
          <p className="text-muted-foreground">Manage and compare your saved products.</p>
        </div>
        <Button onClick={handleAddProduct} className="w-full md:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Sort by: {sortKey.charAt(0).toUpperCase() + sortKey.slice(1)}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortKey("date")}>Date Added</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortKey("name")}>Name</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortKey("price")}>Lowest Price</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ProductForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      {sortedAndFilteredProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {sortedAndFilteredProducts.map((product) => (
                <ProductCard 
                    key={product.id} 
                    product={product} 
                    onEdit={() => handleEditProduct(product)}
                    onDelete={() => handleDeleteProduct(product.id)}
                />
            ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-medium">No products found</h3>
            <p className="text-muted-foreground mt-2">
                {searchTerm ? `Your search for "${searchTerm}" did not match any products.` : "Get started by adding a new product."}
            </p>
            {!searchTerm && <Button onClick={handleAddProduct} className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add First Product
            </Button>}
        </div>
      )}
    </div>
  );
}
