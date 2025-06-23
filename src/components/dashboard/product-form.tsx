"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Product } from "@/lib/types";
import { PlusCircle, Trash2, Loader2, Sparkles } from "lucide-react";
import { Separator } from "../ui/separator";
import { findSellers } from "@/ai/flows/find-sellers-flow";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";


const sellerSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Seller name is required."),
    address: z.string().optional(),
    phone: z.string().optional(),
    price: z.preprocess(
      (a) => parseFloat(z.string().parse(a)),
      z.number().positive("Price must be positive.")
    ),
    isOnline: z.boolean().default(false),
});

const attributeSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Attribute name is required."),
    value: z.string().min(1, "Attribute value is required."),
});

const formSchema = z.object({
  name: z.string().min(2, "Product name is required."),
  model: z.string().min(1, "Model name is required."),
  attributes: z.array(attributeSchema).min(1, "At least one attribute is required."),
  sellers: z.array(sellerSchema),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  product?: Product;
  onSave: (product: Product) => void;
}

export function ProductForm({ isOpen, setIsOpen, product, onSave }: ProductFormProps) {
  const { toast } = useToast();
  const [isFindingSellers, setIsFindingSellers] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      model: "",
      attributes: [{ name: "", value: "" }],
      sellers: [],
    },
  });

  const { fields: attributeFields, append: appendAttribute, remove: removeAttribute } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  const { fields: sellerFields, append: appendSeller, remove: removeSeller } = useFieldArray({
    control: form.control,
    name: "sellers",
  });

  useEffect(() => {
    if (isOpen) {
        if (product) {
        form.reset({
            name: product.name,
            model: product.model,
            attributes: product.attributes,
            sellers: product.sellers,
        });
        } else {
            form.reset({
                name: "",
                model: "",
                attributes: [{ name: "", value: "" }],
                sellers: [],
            });
        }
    }
  }, [product, isOpen, form]);

  const handleFindSellers = async () => {
    const { name, model } = form.getValues();
    if (!name || !model) {
      toast({
        title: "Missing Information",
        description: "Please enter a Product Name and Model Name first.",
        variant: "destructive",
      });
      return;
    }

    setIsFindingSellers(true);
    try {
      const result = await findSellers({ productName: name, modelName: model });
      const sellersWithIds = result.sellers.map(s => ({ ...s, id: uuidv4() }));
      form.setValue('sellers', sellersWithIds, { shouldValidate: true });
    } catch (error) {
      console.error("Error finding sellers:", error);
      toast({
        title: "AI Error",
        description: "Could not fetch sellers at this time. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFindingSellers(false);
    }
  };

  const onSubmit = (data: ProductFormValues) => {
    const newProduct: Product = {
        id: product?.id || uuidv4(),
        userId: product?.userId || 'user_123',
        createdAt: product?.createdAt || new Date(),
        ...data,
        attributes: data.attributes.map(a => ({ ...a, id: a.id || uuidv4() })),
        sellers: data.sellers.map(s => ({ ...s, id: s.id || uuidv4() })),
    };
    onSave(newProduct);
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline">{product ? "Edit Product" : "Add a New Product"}</DialogTitle>
          <DialogDescription>
            {product ? "Update the details for your product." : "Fill in the details to add a new product for comparison."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea className="h-[60vh] p-1 pr-4">
            <div className="space-y-6 p-2">
            {/* Product Details */}
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Product Name</FormLabel><FormControl><Input placeholder="e.g., Samsung Galaxy S23" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="model" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Model Name</FormLabel>
                <FormControl><Input placeholder="e.g., SM-S911B" {...field} /></FormControl>
                <FormDescription>
                  You can usually find this on the energy rating sticker on most appliances.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />

            <Separator />

            {/* Attributes */}
            <div>
              <h3 className="text-lg font-medium font-headline mb-2">Attributes</h3>
              <div className="space-y-4">
                {attributeFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-end p-3 bg-secondary/50 rounded-md">
                    <FormField name={`attributes.${index}.name`} control={form.control} render={({ field }) => (
                      <FormItem className="flex-1"><FormLabel>Name</FormLabel><FormControl><Input placeholder="Screen Size" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField name={`attributes.${index}.value`} control={form.control} render={({ field }) => (
                      <FormItem className="flex-1"><FormLabel>Value</FormLabel><FormControl><Input placeholder="6.1 inches" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeAttribute(index)} disabled={attributeFields.length <= 1}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendAttribute({ name: "", value: "" })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Attribute
                </Button>
              </div>
            </div>

            <Separator />
            
            {/* Sellers */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium font-headline">Sellers</h3>
                <Button type="button" variant="outline" size="sm" onClick={handleFindSellers} disabled={isFindingSellers}>
                  {isFindingSellers ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4 text-accent" />}
                  Find Sellers with AI
                </Button>
              </div>
              <div className="space-y-4">
                {sellerFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-2 gap-4 p-3 bg-secondary/50 rounded-md relative">
                    <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => removeSeller(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <FormField name={`sellers.${index}.name`} control={form.control} render={({ field }) => (
                      <FormItem><FormLabel>Seller Name</FormLabel><FormControl><Input placeholder="Amazon" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField name={`sellers.${index}.price`} control={form.control} render={({ field }) => (
                      <FormItem><FormLabel>Price (INR)</FormLabel><FormControl><Input type="number" placeholder="65000" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField name={`sellers.${index}.address`} control={form.control} render={({ field }) => (
                      <FormItem><FormLabel>Address (Optional)</FormLabel><FormControl><Input placeholder="Mumbai, IN" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField name={`sellers.${index}.phone`} control={form.control} render={({ field }) => (
                      <FormItem><FormLabel>Phone (Optional)</FormLabel><FormControl><Input placeholder="+91..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                ))}
                 <Button type="button" variant="outline" size="sm" onClick={() => appendSeller({ name: "", price: 0 })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Seller Manually
                </Button>
                 {form.formState.errors.sellers && form.getValues('sellers').length === 0 && (
                  <p className="text-sm font-medium text-destructive">{form.formState.errors.sellers.message}</p>
                )}
              </div>
            </div>
            </div>
            </ScrollArea>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Product
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
