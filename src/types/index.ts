export type GarmentType =
  | 'classic-crew'
  | 'heavyweight-tee'
  | 'oversized-boxy'
  | 'french-terry-hoodie'
  | 'pique-polo'
  | 'ceramic-cup'
  | 'photo-pillow'
  | 'sipper-bottle'
  | 'keychain'
  | 'photo-frame'
  | 'mobile-case';

export type PrintView = 'front' | 'back' | 'leftSleeve' | 'rightSleeve';

export interface GarmentOption {
  id: GarmentType;
  name: string;
  subtitle: string;
  basePrice: number;
  weightGsm: number;
  material: string;
  fit: string;
}

export interface GarmentColor {
  name: string;
  hex: string;
  shadowHex: string;
}

export interface DesignObject {
  id: string;
  type: 'image' | 'text' | 'sticker' | 'shape';
  imageUrl?: string;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  textColor?: string;
  fontWeight?: 'normal' | 'bold' | '600' | '800';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  textAlign?: 'left' | 'center' | 'right';
  letterSpacing?: number;
  lineHeight?: number;
  x: number; // percentage (0-100) or pixels
  y: number; // percentage (0-100) or pixels
  width: number;
  height: number;
  rotation: number; // degrees 0-360
  scaleX: number;
  scaleY: number;
  opacity: number; // 0-1
  zIndex: number;
  locked: boolean;
  visible: boolean;
  flipX: boolean;
  flipY: boolean;
  groupId?: string;
  keepAspectRatio?: boolean;
  // Image metadata for quality warning
  originalWidth?: number;
  originalHeight?: number;
  fileSizeBytes?: number;
  fileType?: string;
  isTransparentPng?: boolean;
}

export interface ViewDesignState {
  objects: DesignObject[];
}

export interface CompleteDesign {
  id: string;
  userId?: string;
  title: string;
  garmentId: GarmentType;
  sourceProductId?: string;
  productName?: string;
  productBasePrice?: number;
  productSizes?: string[];
  productColors?: GarmentColor[];
  productMaterial?: string;
  productModelVariants?: Record<string, string[]>;
  productBrand?: string;
  productModel?: string;
  shirtColor: string; // hex
  shirtColorName: string;
  views: {
    front: ViewDesignState;
    back: ViewDesignState;
    leftSleeve: ViewDesignState;
    rightSleeve: ViewDesignState;
  };
  thumbnailUrl?: string;
  createdAt: number;
  updatedAt: number;
  calculatedPrice: number;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category:
    | 'men'
    | 'women'
    | 'oversized'
    | 'hoodies'
    | 'custom'
    | 'kids'
    | 'cups'
    | 'pillows'
    | 'bottles'
    | 'keychains'
    | 'frames'
    | 'mobile-covers';
  basePrice: number;
  originalPrice?: number;
  discountPercent?: number;
  images: string[];
  colors: GarmentColor[];
  sizes: string[];
  material: string;
  weightGsm: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  garmentType: GarmentType;
  modelVariants?: Record<string, string[]>;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  features: string[];
}

export interface CartItem {
  id: string; // unique cart line item id
  productId: string;
  productName: string;
  garmentType: GarmentType;
  colorName: string;
  colorHex: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customDesign?: CompleteDesign;
  designThumbnail?: string;
  printLocations: string[];
}

export interface OrderShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type OrderStatus =
  | 'Processing'
  | 'Printing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'confirmed'
  | 'pending';

export interface Order {
  orderId: string;
  createdAt: number;
  items: CartItem[];
  shippingAddress: OrderShippingAddress;
  shippingMethod: 'standard' | 'express';
  shippingCost: number;
  taxAmount: number;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending' | 'paid' | 'pending' | 'failed' | 'refunded';
  orderStatus: OrderStatus;
  estimatedDeliveryDate: string;
  trackingNumber: string;
  paymentId?: string;
  gatewayOrderId?: string;
  currency?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role?: 'user' | 'admin';
  isEmailVerified?: boolean;
  createdAt: number;
}

export interface CustomerInquiry {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  preferredProduct?: string;
  status: 'New' | 'Contacted' | 'Quoted' | 'Closed';
  createdAt: number;
}

export type NavigationPage = 
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'designer'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'account'
  | 'about'
  | 'contact'
  | 'login'
  | 'admin';

export interface DatabaseConfig {
  provider: 'local' | 'firestore' | 'postgresql' | 'supabase' | 'rest_api';
  endpointUrl: string;
  apiKey: string;
  projectId: string;
  isConnected: boolean;
  lastSyncedAt: number | null;
  autoSync: boolean;
}

export interface StoreSettings {
  storeName: string;
  proprietor: string;
  phone1: string;
  phone2: string;
  upiId: string;
  freeShippingThreshold: number;
  announcementText: string;
  isStoreLive: boolean;
  gstRate: number;
}

export type AdminTab = 
  | 'overview' 
  | 'orders' 
  | 'products' 
  | 'custom-jobs' 
  | 'inquiries' 
  | 'database';
