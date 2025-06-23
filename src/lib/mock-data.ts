import { Product } from './types';

export const mockProducts: Product[] = [
  {
    id: 'prod_1',
    userId: 'user_123',
    name: 'Samsung Galaxy S23',
    model: 'SM-S911B',
    createdAt: new Date('2023-08-15T10:00:00Z'),
    attributes: [
      { id: 'attr_1_1', name: 'Screen Size', value: '6.1 inches' },
      { id: 'attr_1_2', name: 'Resolution', value: '2340 x 1080' },
      { id: 'attr_1_3', name: 'Storage', value: '256GB' },
      { id: 'attr_1_4', name: 'RAM', value: '8GB' },
    ],
    sellers: [
      { id: 'seller_1_1', name: 'Amazon', price: 65000, isOnline: true, link: 'https://www.amazon.in/dp/B0BT9CXXXX' },
      { id: 'seller_1_2', name: 'Vijay Sales', price: 64500, address: 'Mumbai, IN', isOnline: false },
    ],
  },
  {
    id: 'prod_2',
    userId: 'user_123',
    name: 'Apple iPhone 14 Pro',
    model: 'A2890',
    createdAt: new Date('2023-09-01T14:30:00Z'),
    attributes: [
      { id: 'attr_2_1', name: 'Screen Size', value: '6.1 inches' },
      { id: 'attr_2_2', name: 'Resolution', value: '2556 x 1179' },
      { id: 'attr_2_3', name: 'Storage', value: '256GB' },
      { id: 'attr_2_4', name: 'RAM', value: '6GB' },
    ],
    sellers: [
      { id: 'seller_2_1', name: 'Flipkart', price: 129900, isOnline: true, link: 'https://www.flipkart.com/apple-iphone-14-pro-deep-purple-256-gb/p/itm1a36253f65b3d' },
      { id: 'seller_2_2', name: 'Croma', price: 129000, address: 'Delhi, IN', isOnline: false },
      { id: 'seller_2_3', name: 'Reliance Digital', price: 129900, isOnline: true, link: 'https://www.reliancedigital.in/apple-iphone-14-pro-256-gb-deep-purple/p/493177755' },
    ],
  },
  {
    id: 'prod_3',
    userId: 'user_123',
    name: 'Sony Bravia 55" TV',
    model: 'XR-55A80L',
    createdAt: new Date('2023-07-20T09:00:00Z'),
    attributes: [
        { id: 'attr_3_1', name: 'Screen Size', value: '55 inches' },
        { id: 'attr_3_2', name: 'Resolution', value: '4K UHD (3840 x 2160)' },
        { id: 'attr_3_3', name: 'Panel Type', value: 'OLED' },
        { id: 'attr_3_4', name: 'Refresh Rate', value: '120Hz' },
    ],
    sellers: [
        { id: 'seller_3_1', name: 'Sony Center', price: 150000, address: 'Bangalore, IN', isOnline: false },
        { id: 'seller_3_2', name: 'Amazon', price: 145000, isOnline: true, link: 'https://www.amazon.in/Sony-Bravia-inches-XR-55A80L-Black/dp/B0BZF5V6B2' },
    ],
  }
];
