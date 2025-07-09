"use client";

import { useState, useEffect } from "react";
import { PlusCircle, ArrowUpDown, Search, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";
import { ProductForm } from "./product-form";
import type { Product } from "@/lib/types";
import { Input } from "../ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { getProducts, saveProduct, deleteProduct } from "@/lib/product-service";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { TourGuide } from "./tour-guide";

export function ProductList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [sortKey, setSortKey] = useState<"name" | "price" | "date">("date");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async (uid: string) => {
    setIsLoading(true);
    try {
      const userProducts = await getProducts(uid);
      setProducts(userProducts);
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch your products.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchProducts(user.uid);
    } else {
      setProducts([]);
      setIsLoading(false);
    }
  }, [user, toast]);


  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };
  
  const handleDeleteProduct = async (userProductId: string) => {
    try {
        await deleteProduct(userProductId);
        setProducts(currentProducts => currentProducts.filter(p => p.id !== userProductId));
        toast({ title: "Product Removed", description: "The product has been successfully removed from your list." });
    } catch (error) {
        console.error("Failed to delete product", error);
        toast({ variant: "destructive", title: "Error", description: "Could not remove the product." });
    }
  };

  const handleSaveProduct = async (productData: Product) => {
    if (!user) return;

    try {
        await saveProduct(productData, user.uid);
        toast({ title: "Product Saved", description: "Your product has been successfully saved." });
        // Refresh the entire list to ensure data consistency
        fetchProducts(user.uid);
    } catch (err) {
        console.error("Failed to save product", err);
        toast({ variant: "destructive", title: "Error", description: "Could not save the product." });
    }
  };

  const sortedAndFilteredProducts = products
    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.model.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortKey === "price") {
        const priceA = a.sellers.length > 0 ? Math.min(...a.sellers.map(s => s.price)) : Infinity;
        const priceB = b.sellers.length > 0 ? Math.min(...b.sellers.map(s => s.price)) : Infinity;
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
        <div className="flex gap-2">
            <TourGuide />
            <Button id="add-product-btn" onClick={handleAddProduct} className="w-full md:w-auto" disabled={!user}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
            </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={!user}
          />
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto" disabled={!user}>
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
        userId={user?.uid}
      />
    
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[125px] w-full rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[80%]" />
                    </div>
                </div>
            ))}
        </div>
      ) : sortedAndFilteredProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" id="product-list-container">
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
            <h3 className="text-xl font-medium">
                { !user 
                    ? "Please log in to see your products" 
                    : "No products found"
                }
            </h3>
            <p className="text-muted-foreground mt-2">
                { !user
                    ? "Once you log in, your saved products will appear here."
                    : searchTerm 
                        ? `Your search for "${searchTerm}" did not match any products.` 
                        : "Get started by adding a new product."
                }
            </p>
            {!searchTerm && user && <Button onClick={handleAddProduct} className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add First Product
            </Button>}
        </div>
      )}
    </div>
  );
}
