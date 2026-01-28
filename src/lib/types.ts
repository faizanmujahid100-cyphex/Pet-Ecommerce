import type { Timestamp } from 'firebase/firestore';

export interface DeliveryInfo {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'customer';
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  defaultDeliveryInfo?: DeliveryInfo;
}

export type ProductCategory =
  | 'food'
  | 'toys'
  | 'litter'
  | 'accessories'
  | 'siamese'
  | 'persian'
  | 'sphynx';

export interface Product {
  id: string;
  name: string;
  type: 'cat' | 'pet_product';
  category: ProductCategory;
  description: string;
  price: number;
  currency: string;
  stockQuantity: number;
  mainImageUrl: string;
  galleryImageUrls: string[];
  isFeatured: boolean;
  isListed: boolean;
  ratingAverage: number;
  ratingCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  mainImageUrl: string;
}

export interface Order {
  id: string;
  userId: string | null;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryInfo: DeliveryInfo;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
