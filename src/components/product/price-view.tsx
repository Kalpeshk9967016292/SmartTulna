'use client';

import type { Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Badge } from '../ui/badge';
import { Globe, Store } from 'lucide-react';

interface PriceViewProps {
  product: Product;
}

const chartConfig = {
    price: {
        label: 'Price (INR)',
        color: 'hsl(var(--primary))',
    },
} satisfies ChartConfig;

export function PriceView({ product }: PriceViewProps) {
    const sortedSellers = [...product.sellers].sort((a, b) => a.price - b.price);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
        }).format(price).replace('₹', 'Rs.');
    };

    const chartData = sortedSellers.map(seller => ({
        name: seller.name,
        price: seller.price,
    }));

    return (
        <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">{product.name}</CardTitle>
                    <CardDescription>{product.model}</CardDescription>
                </CardHeader>
                <CardContent>
                    <h3 className="font-semibold mb-2">Key Attributes</h3>
                    <ul className="space-y-2">
                        {product.attributes.map((attr) => (
                        <li key={attr.id} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{attr.name}</span>
                            <span className="font-medium text-right">{attr.value}</span>
                        </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>All Sellers</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Seller</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {sortedSellers.map((seller) => (
                            <TableRow key={seller.id}>
                                <TableCell>
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
                                </TableCell>
                                <TableCell className="text-right font-semibold">{formatPrice(seller.price)}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-3">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Price Comparison</CardTitle>
                    <CardDescription>Visual comparison of prices across sellers.</CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-8rem)]">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis 
                                tickFormatter={(value) => `Rs.${Number(value) / 1000}k`}
                                tickLine={false}
                                axisLine={false}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent
                                    formatter={(value) => formatPrice(Number(value))}
                                    indicator="dot"
                                />}
                            />
                            <Bar dataKey="price" fill="var(--color-price)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
        </div>
    );
}
