import type { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'customer';
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  defaultDeliveryInfo?: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
  };
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
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryInfo: Record<string, any>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Rating {
  id: string;
  productId: string;
  userId: string;
  ratingValue: number;
  reviewText?: string;
  createdAt: Timestamp;
}

export interface DeliveryFormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'phone' | 'textarea' | 'select';
  placeholder?: string;
  isRequired: boolean;
  defaultValue?: string;
  options?: string[];
}

export interface DeliveryFormSchema {
  id: 'default';
  fields: DeliveryFormField[];
  updatedAt: Timestamp;
}
