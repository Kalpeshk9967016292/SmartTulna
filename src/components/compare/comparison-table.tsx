"use client";

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockProducts } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

export function ComparisonTable() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(mockProducts.slice(0, 2));

  const handleSelectProduct = (product: Product, checked: boolean | 'indeterminate') => {
    if (checked) {
      setSelectedProducts([...selectedProducts, product]);
    } else {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    }
  };

  const allAttributes = Array.from(new Set(selectedProducts.flatMap(p => p.attributes.map(a => a.name))));
  const allSellers = Array.from(new Set(selectedProducts.flatMap(p => p.sellers.map(s => s.name))));
  
  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return <span className="text-muted-foreground">-</span>;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
            <h3 className="font-headline text-lg mb-2">Select Products to Compare</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mockProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-2">
                <Checkbox
                    id={`select-${product.id}`}
                    checked={selectedProducts.some((p) => p.id === product.id)}
                    onCheckedChange={(checked) => handleSelectProduct(product, checked)}
                />
                <label
                    htmlFor={`select-${product.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {product.name}
                </label>
                </div>
            ))}
            </div>
        </CardContent>
      </Card>
      
      {selectedProducts.length > 0 ? (
        <Card>
        <ScrollArea>
          <Table className="min-w-max">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] font-headline text-base sticky left-0 bg-card">Feature</TableHead>
                {selectedProducts.map((product) => (
                  <TableHead key={product.id} className="font-headline text-base">
                    {product.name}
                    <p className="font-body text-sm font-normal text-muted-foreground">{product.model}</p>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                  <TableCell colSpan={selectedProducts.length + 1} className="font-bold text-primary">Key Attributes</TableCell>
              </TableRow>
              {allAttributes.map((attrName) => (
                <TableRow key={attrName}>
                  <TableCell className="font-medium sticky left-0 bg-card">{attrName}</TableCell>
                  {selectedProducts.map((product) => {
                    const attr = product.attributes.find((a) => a.name === attrName);
                    return <TableCell key={product.id}>{attr?.value || <span className="text-muted-foreground">-</span>}</TableCell>;
                  })}
                </TableRow>
              ))}

              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                  <TableCell colSpan={selectedProducts.length + 1} className="font-bold text-primary">Prices</TableCell>
              </TableRow>
              {allSellers.map((sellerName) => (
                <TableRow key={sellerName}>
                  <TableCell className="font-medium sticky left-0 bg-card">{sellerName}</TableCell>
                  {selectedProducts.map((product) => {
                    const seller = product.sellers.find((s) => s.name === sellerName);
                    return <TableCell key={product.id}>{formatPrice(seller?.price)}</TableCell>;
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </Card>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-medium">No Products Selected</h3>
            <p className="text-muted-foreground mt-2">
                Please select at least one product to start comparing.
            </p>
        </div>
      )}
    </div>
  );
}
