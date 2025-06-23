"use client";

import { useEffect } from "react";
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
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import { Separator } from "../ui/separator";

const sellerSchema = z.object({
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
    name: z.string().min(1, "Attribute name is required."),
    value: z.string().min(1, "Attribute value is required."),
});

const formSchema = z.object({
  name: z.string().min(2, "Product name is required."),
  model: z.string().min(1, "Model name is required."),
  attributes: z.array(attributeSchema).min(1, "At least one attribute is required."),
  sellers: z.array(sellerSchema).min(1, "At least one seller is required."),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  product?: Product;
  onSave: (product: Product) => void;
}

export function ProductForm({ isOpen, setIsOpen, product, onSave }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      model: "",
      attributes: [{ name: "", value: "" }],
      sellers: [{ name: "", price: 0, isOnline: true }],
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
    if (product) {
      form.reset({
        name: product.name,
        model: product.model,
        attributes: product.attributes.map(a => ({ name: a.name, value: a.value })),
        sellers: product.sellers.map(s => ({ name: s.name, address: s.address, phone: s.phone, price: s.price, isOnline: s.isOnline })),
      });
    } else {
        form.reset({
            name: "",
            model: "",
            attributes: [{ name: "", value: "" }],
            sellers: [{ name: "", price: 0, isOnline: true }],
        });
    }
  }, [product, isOpen, form]);

  const onSubmit = (data: ProductFormValues) => {
    const newProduct: Product = {
        id: product?.id || `prod_${new Date().getTime()}`,
        userId: product?.userId || 'user_123',
        createdAt: product?.createdAt || new Date(),
        ...data,
        attributes: data.attributes.map((a, i) => ({ ...a, id: product?.attributes[i]?.id || `attr_${i}_${new Date().getTime()}` })),
        sellers: data.sellers.map((s, i) => ({ ...s, id: product?.sellers[i]?.id || `seller_${i}_${new Date().getTime()}` })),
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
              <h3 className="text-lg font-medium font-headline mb-2">Sellers</h3>
              <div className="space-y-4">
                {sellerFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-2 gap-4 p-3 bg-secondary/50 rounded-md relative">
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
                     <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => removeSeller(index)} disabled={sellerFields.length <= 1}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                 <Button type="button" variant="outline" size="sm" onClick={() => appendSeller({ name: "", price: 0 })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Seller
                </Button>
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
