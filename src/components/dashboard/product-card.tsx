"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Product } from "@/lib/types";
import { format } from "date-fns";
import { MoreVertical, Edit, Trash2, Globe, Store, BarChart2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const lowestPrice = product.sellers.length > 0 ? Math.min(...product.sellers.map((s) => s.price)) : 0;
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price).replace('₹', 'Rs.');
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-xl">{product.name}</CardTitle>
                <CardDescription>{product.model}</CardDescription>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEdit}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the product
                                "{product.name}" and all its data.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-4">
            <p className="text-sm text-muted-foreground">Starting from</p>
            <p className="text-3xl font-bold text-primary">{formatPrice(lowestPrice)}</p>
        </div>

        <Accordion type="multiple" className="w-full">
          <AccordionItem value="sellers">
            <AccordionTrigger className="text-base">Sellers ({product.sellers.length})</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3 pt-2">
                {product.sellers.sort((a,b) => a.price - b.price).map((seller) => (
                  <li key={seller.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                        {seller.isOnline ? <Globe className="h-4 w-4 text-accent"/> : <Store className="h-4 w-4 text-accent"/>}
                        <div>
                            {seller.isOnline && seller.link ? (
                                <a href={seller.link} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline hover:text-primary">
                                    {seller.name}
                                </a>
                            ) : (
                                <span className="font-medium">{seller.name}</span>
                            )}
                            <div className="text-xs text-muted-foreground">
                                {seller.isOnline 
                                    ? <Badge variant="outline" className="border-green-500/50 text-green-600">Online</Badge> 
                                    : <Badge variant="outline" className="border-blue-500/50 text-blue-600">Local</Badge>
                                }
                            </div>
                        </div>
                    </div>
                    <span className="font-semibold">{formatPrice(seller.price)}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="attributes">
            <AccordionTrigger className="text-base">Attributes ({product.attributes.length})</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 pt-2">
                {product.attributes.map((attr) => (
                  <li key={attr.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{attr.name}</span>
                    <span className="font-medium text-right">{attr.value}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-6">
        <p className="text-xs text-muted-foreground">Added on {format(product.createdAt, "PPP")}</p>
        <Button asChild variant="outline" size="sm">
          <Link href={`/product/${product.id}`}>
            <BarChart2 className="mr-2 h-4 w-4" />
            Compare
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
