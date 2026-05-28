export type CategoryType = 'all' | 'baijiu' | 'fruitwine' | 'wine' | 'beer' | 'accessories';

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  galleryImages: string[];
  moq: number; // in boxes/cases
  quantityPerBox: number; // e.g. 12 bottles per box
  stock: number; // in items/cases
  abv?: string;
  origin?: string;
  barrelType?: string;
  boxWeight?: string;
  category: CategoryType;
  tags?: string[];
  specs?: string[];
  overviewNotes?: string;
}

export interface CartItem {
  id: string; // unique cart item id
  productId: string;
  quantity: number; // in boxes/bottles (wholesale lists are in cases or items, we'll track quantity in boxes because B2B ordering is box-centric)
  checked: boolean;
}

export interface Order {
  id: string;
  code: string;
  date: string;
  createdAt: string; // ISO date string for credit period calculation
  status: 'pending' | 'shipping' | 'completed';
  items: {
    productId: string;
    quantity: number; // boxes purchased
    priceAtPurchase: number;
  }[];
  totalPrice: number;
}

export interface ShippingAddress {
  id: string;
  recipient: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

export interface SupportMessage {
  id: string;
  sender: 'user' | 'support';
  text: string;
  timestamp: string;
}
