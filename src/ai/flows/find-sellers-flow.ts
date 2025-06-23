'use server';
/**
 * @fileOverview An AI flow to find sellers for a given product.
 *
 * - findSellers - A function that finds sellers and their prices.
 * - FindSellersInput - The input type for the findSellers function.
 * - FindSellersOutput - The return type for the findSellers function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const FindSellersInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  modelName: z.string().describe('The model name or number of the product.'),
});
export type FindSellersInput = z.infer<typeof FindSellersInputSchema>;

const SellerSchema = z.object({
    name: z.string().describe("The name of the seller or store."),
    price: z.number().describe("The price of the product in INR."),
    isOnline: z.boolean().describe("Whether the seller is online or a physical store."),
    address: z.string().optional().describe("The city and country if it's a physical store."),
    link: z.string().url().optional().describe("A plausible URL to the product page if the seller is online. Omit for physical stores."),
});

const FindSellersOutputSchema = z.object({
    sellers: z.array(SellerSchema).describe("A list of 2 to 4 potential sellers for the product."),
});
export type FindSellersOutput = z.infer<typeof FindSellersOutputSchema>;


export async function findSellers(input: FindSellersInput): Promise<FindSellersOutput> {
  return findSellersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findSellersPrompt',
  input: { schema: FindSellersInputSchema },
  output: { schema: FindSellersOutputSchema },
  prompt: `You are an expert shopping assistant in India. Your task is to find a list of potential sellers for a given product.

Provide a list of 2 to 4 sellers, including a mix of major online retailers (like Amazon.in, Flipkart, Reliance Digital) and plausible names for local physical stores.

For each seller, provide a realistic price in Indian Rupees (INR).
For online sellers, include a plausible, but not necessarily real, URL to a product page. For physical stores, the link should be omitted.

Product Name: {{{productName}}}
Model: {{{modelName}}}

Generate the response in the requested JSON format.`,
});

const findSellersFlow = ai.defineFlow(
  {
    name: 'findSellersFlow',
    inputSchema: FindSellersInputSchema,
    outputSchema: FindSellersOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        throw new Error("Failed to get a response from the AI model.");
    }
    return output;
  }
);
