'use server';
/**
 * @fileOverview An AI flow to find online sellers for a given product.
 *
 * - findSellers - A function that finds online sellers and prices.
 * - FindSellersInput - The input type for the findSellers function.
 * - FindSellersOutput - The return type for the findSellers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

// Schema for a single seller, matching the app's data structure.
// The AI will only find online sellers.
const SellerSchema = z.object({
  name: z.string().describe('The name of the online store.'),
  price: z.number().describe('The price of the product in INR. Must be a number, without currency symbols.'),
  link: z.string().url().describe('A direct URL to the product page.'),
});

const FindSellersInputSchema = z.object({
  productName: z.string().describe('The name of the product, e.g., "Samsung Galaxy S23".'),
  model: z.string().describe('The model number of the product, e.g., "SM-S911B".'),
});
export type FindSellersInput = z.infer<typeof FindSellersInputSchema>;

const FindSellersOutputSchema = z.object({
  sellers: z.array(SellerSchema).describe('A list of online sellers found for the product.'),
});
export type FindSellersOutput = z.infer<typeof FindSellersOutputSchema>;

export async function findSellers(input: FindSellersInput): Promise<FindSellersOutput> {
  return findSellersFlow(input);
}

const findSellersPrompt = ai.definePrompt({
  name: 'findSellersPrompt',
  input: {schema: FindSellersInputSchema},
  output: {schema: FindSellersOutputSchema},
  prompt: `You are an expert shopping assistant. Your task is to find the best online prices in India for a specific product.

Product Name: {{{productName}}}
Model: {{{model}}}

Search the web for this product and identify up to 3 different online sellers (e.g., Amazon.in, Flipkart, Croma, Reliance Digital).

For each seller, provide their name, the product's price in INR (as a number only), and a direct link to the product page.

Return the information in the specified JSON format. If you cannot find any sellers, return an empty array.
`,
});

const findSellersFlow = ai.defineFlow(
  {
    name: 'findSellersFlow',
    inputSchema: FindSellersInputSchema,
    outputSchema: FindSellersOutputSchema,
  },
  async (input) => {
    // Basic validation to prevent empty calls
    if (!input.productName || !input.model) {
      return { sellers: [] };
    }
    
    const {output} = await findSellersPrompt(input);
    return output || { sellers: [] };
  }
);
