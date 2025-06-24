'use client';

import { getProduct } from '@/lib/product-service';
import { PriceView } from '@/components/product/price-view';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductPage() {
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (product) {
      document.title = `${product.name} - ${product.model} | SmartTulna`;
    } else {
      document.title = "Product Details | SmartTulna";
    }
  }, [product]);

  useEffect(() => {
    if (authLoading) {
      return;
    }
    if (!user) {
      setError("You must be logged in to view this page.");
      setIsLoading(false);
      return;
    }
    if (!id) {
        setIsLoading(false);
        notFound();
        return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedProduct = await getProduct(id);
        if (fetchedProduct) {
            if (fetchedProduct.userId === user.uid) {
                setProduct(fetchedProduct);
            } else {
                // This prevents users from accessing other users' product pages via direct URL.
                setError("You do not have permission to view this product.");
            }
        } else {
            notFound();
        }
      } catch (e) {
        console.error("Failed to fetch product", e);
        setError("Failed to load product data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, user, authLoading]);

  const renderContent = () => {
      if (isLoading || authLoading) {
          return (
            <div className="space-y-8">
              <div className="grid gap-8 lg:grid-cols-5">
                  <div className="lg:col-span-2 space-y-8">
                      <Skeleton className="h-48 w-full rounded-lg" />
                      <Skeleton className="h-64 w-full rounded-lg" />
                  </div>
                  <div className="lg:col-span-3">
                      <Skeleton className="h-[500px] w-full rounded-lg" />
                  </div>
              </div>
            </div>
          );
      }

      if (error) {
          return (
              <div className="text-center py-16 border-2 border-dashed rounded-lg">
                  <h2 className="text-xl font-semibold text-destructive">{error}</h2>
                  <p className="text-muted-foreground mt-2">Please go back to your dashboard and try again.</p>
              </div>
          )
      }

      if (product) {
        return <PriceView product={product} />;
      }

      return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      {renderContent()}
    </div>
  );
}
