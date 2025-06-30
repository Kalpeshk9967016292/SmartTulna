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
import { PlusCircle, Trash2, Loader2, WandSparkles } from "lucide-react";
import { Separator } from "../ui/separator";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { findSellers } from "@/ai/flows/find-sellers-flow";


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
    link: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

const attributeSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Attribute name is required."),
    value: z.string().min(1, "Attribute value is required."),
});

const formSchema = z.object({
  name: z.string().min(2, "Product name is required."),
  model: z.string().min(1, "Model name is required."),
  attributes: z.array(attributeSchema),
  sellers: z.array(sellerSchema),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  product?: Product;
  onSave: (product: Product) => void;
  userId?: string;
}

export function ProductForm({ isOpen, setIsOpen, product, onSave, userId }: ProductFormProps) {
  const { toast } = useToast();
  const [showAttributes, setShowAttributes] = useState(false);
  const [isFindingSellers, setIsFindingSellers] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      model: "",
      attributes: [],
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
                attributes: product.attributes || [],
                sellers: product.sellers,
            });
            if (product.attributes && product.attributes.length > 0) {
                setShowAttributes(true);
            } else {
                setShowAttributes(false);
            }
        } else {
            form.reset({
                name: "",
                model: "",
                attributes: [],
                sellers: [],
            });
            setShowAttributes(false);
        }
    }
  }, [product, isOpen, form]);

  const onSubmit = (data: ProductFormValues) => {
    if (!userId) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to save a product.",
        });
        return;
    }
    
    const newProduct: Product = {
        id: product?.id || uuidv4(),
        userId: product?.userId || userId,
        createdAt: product?.createdAt || new Date(),
        ...data,
        attributes: data.attributes.map(a => ({ ...a, id: a.id || uuidv4() })),
        sellers: data.sellers.map(s => ({ ...s, id: s.id || uuidv4() })),
    };
    onSave(newProduct);
    setIsOpen(false);
  };

  const handleAIFindSellers = async () => {
    const productName = form.getValues("name");
    const model = form.getValues("model");

    if (!productName || !model) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter a product name and model first.",
      });
      return;
    }

    setIsFindingSellers(true);
    try {
      const result = await findSellers({ productName, model });
      if (result && result.sellers.length > 0) {
        let addedCount = 0;
        result.sellers.forEach(seller => {
          const sellerExists = form.getValues('sellers').some(s => s.name.toLowerCase() === seller.name.toLowerCase());
          if (!sellerExists) {
              appendSeller({
                  id: uuidv4(),
                  name: seller.name,
                  price: seller.price,
                  link: seller.link,
                  isOnline: true,
                  address: '',
                  phone: ''
              });
              addedCount++;
          }
        });
        toast({
          title: "Sellers Found!",
          description: `Added ${addedCount} new online seller(s).`,
        });
      } else {
        toast({
          title: "No Sellers Found",
          description: "The AI couldn't find any online sellers for this product.",
        });
      }
    } catch (error) {
      console.error("AI find sellers error:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Something went wrong while searching for sellers.",
      });
    } finally {
      setIsFindingSellers(false);
    }
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

            {/* Attribute Toggle */}
            <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-background p-3">
                <div className="space-y-0.5">
                    <FormLabel>Add Specific Attributes</FormLabel>
                    <FormDescription>
                        Add technical specifications or other details.
                    </FormDescription>
                </div>
                <FormControl>
                <Switch
                    checked={showAttributes}
                    onCheckedChange={(checked) => {
                        setShowAttributes(checked);
                        if (checked && attributeFields.length === 0) {
                            appendAttribute({ name: '', value: '' });
                        } else if (!checked) {
                            form.setValue('attributes', []);
                        }
                    }}
                />
                </FormControl>
            </FormItem>

            {/* Attributes Section */}
            {showAttributes && (
                <div className="space-y-4">
                    {attributeFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-end p-3 bg-secondary/50 rounded-md">
                        <FormField name={`attributes.${index}.name`} control={form.control} render={({ field }) => (
                        <FormItem className="flex-1"><FormLabel>Name</FormLabel><FormControl><Input placeholder="Screen Size" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField name={`attributes.${index}.value`} control={form.control} render={({ field }) => (
                        <FormItem className="flex-1"><FormLabel>Value</FormLabel><FormControl><Input placeholder="6.1 inches" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeAttribute(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => appendAttribute({ name: "", value: "" })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Attribute
                    </Button>
                </div>
            )}


            <Separator />
            
            {/* Sellers */}
            <div>
              <h3 className="text-lg font-medium font-headline mb-2">Sellers</h3>
              <div className="space-y-4">
                {sellerFields.map((field, index) => {
                    const isOnline = form.watch(`sellers.${index}.isOnline`);
                    return (
                        <div key={field.id} className="space-y-4 p-3 bg-secondary/50 rounded-md relative">
                            <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => removeSeller(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField name={`sellers.${index}.name`} control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Seller Name</FormLabel><FormControl><Input placeholder="Amazon" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField name={`sellers.${index}.price`} control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Price (INR)</FormLabel><FormControl><Input type="number" placeholder="65000" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            
                            <FormField control={form.control} name={`sellers.${index}.isOnline`} render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-background p-3">
                                    <FormLabel>Online Seller</FormLabel>
                                    <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    </FormControl>
                                </FormItem>
                                )}
                            />

                            {isOnline ? (
                                <FormField name={`sellers.${index}.link`} control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Website Link</FormLabel><FormControl><Input placeholder="https://www.seller.com/product" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                                )} />
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                <FormField name={`sellers.${index}.address`} control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Address (Optional)</FormLabel><FormControl><Input placeholder="Mumbai, IN" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField name={`sellers.${index}.phone`} control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Phone (Optional)</FormLabel><FormControl><Input placeholder="+91..." {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                                )} />
                                </div>
                            )}
                        </div>
                    )
                })}
                <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => appendSeller({ name: "", price: 0, isOnline: false, link: "", address: "", phone: "" })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Seller Manually
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={handleAIFindSellers} disabled={isFindingSellers || !form.watch('name') || !form.watch('model')}>
                        {isFindingSellers ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <WandSparkles className="mr-2 h-4 w-4 text-accent" />
                        )}
                        AI Find Sellers
                    </Button>
                </div>
                 {form.formState.errors.sellers && form.getValues('sellers').length === 0 && (
                  <p className="text-sm font-medium text-destructive">{form.formState.errors.message}</p>
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
