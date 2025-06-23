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
  isOnline?: boolean;
  link?: string;
};

export type Product = {
  id: string;
  userId: string;
  name:string;
  model: string;
  attributes: Attribute[];
  sellers: Seller[];
  createdAt: Date;
};
