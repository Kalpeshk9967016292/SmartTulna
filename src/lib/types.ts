export type Attribute = {
  id: string;
  name: string;
  value: string;
};

export type Seller = {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  price: number;
  isOnline: boolean;
  link?: string;
};

// This is the composite object used by the UI components.
// It merges a public product with a user's private data for that product.
export type Product = {
  id:string; // The ID of the userProduct document
  userId: string;
  publicProductId: string; // The ID of the associated publicProduct document
  name:string;
  model: string;
  attributes: Attribute[]; // Merged attributes from public data
  sellers: Seller[]; // Merged list of public online sellers and user's private local sellers
  createdAt: Date; // The date the user added the product
  updatedAt?: Date;
};
