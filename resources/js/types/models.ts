export interface User {
  id: number;
  name: string;
  email: string;
  role?: 'admin' | 'user';
  city: string | null;
  postal_code: string | null;
  level: number;
  avatar_url: string | null;
  email_verified_at: string | null;
  created_at?: string;
  updated_at?: string;
  points?: UserPoints;
  badges?: Badge[];
}

export interface Store {
  id: number;
  name: string;
  chain: string;
  address: string;
  city: string;
  country_code: string;
  currency_code: string;
  store_type?: 'supermarket';
  postal_code: string;
  latitude: number;
  longitude: number;
  store_number: string | null;
  distance?: number;
}

export interface Product {
  id: number;
  barcode: string;
  name: string;
  description: string | null;
  brand: string | null;
  category: string | null;
  unit: string;
  unit_amount: number;
  image_url: string | null;
  is_private_label: boolean;
  prices?: Price[];
}

export interface Price {
  id: number;
  product_id: number;
  store_id: number;
  user_id: number;
  price: number;
  price_type: 'normal' | 'promotion';
  normal_price: number | null;
  source_type: 'manual' | 'barcode' | 'receipt' | 'folder';
  proof_image_path: string | null;
  is_promotion: boolean;
  promotion_end_date: string | null;
  verification_count: number;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
  product?: Product;
  store?: Store;
}

export interface ReceiptItem {
  name: string;
  price: number;
}

export interface Receipt {
  id: number;
  user_id: number;
  store_id: number;
  image_path: string;
  ocr_raw_text: string | null;
  parsed_items: ReceiptItem[] | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  items_count: number;
  total_amount: string | null;
  purchase_date: string | null;
  created_at: string;
  updated_at: string;
  store?: Pick<Store, 'id' | 'name' | 'chain' | 'address' | 'city'>;
}

export interface ShoppingList {
  id: number;
  user_id: number;
  name: string;
  city: string | null;
  is_active: boolean;
  items?: ShoppingListItem[];
  created_at: string;
  updated_at: string;
}

export interface ShoppingListItem {
  id: number;
  shopping_list_id: number;
  product_id: number;
  quantity: number;
  is_checked: boolean;
  product?: Product;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string | null;
  type: 'scan_count' | 'verification_count' | 'total_points' | 'city_hero';
  requirement: number;
  earned_at?: string;
}

export interface UserPoints {
  id: number;
  user_id: number;
  total_points: number;
  scans_count: number;
  verifications_count: number;
  city: string | null;
}

export interface LeaderboardEntry {
  user: User;
  total_points: number;
  scans_count: number;
  verifications_count: number;
  city: string | null;
}

export interface StoreComparison {
  store: Store;
  total: number;
  items_available: number;
  total_items: number;
}

export interface OptimizationResult {
  store: Store;
  items: Array<{
    product: Product;
    quantity: number;
    price: number;
    total: number;
  }>;
  total: number;
  item_count: number;
}

export interface StoreRequest {
  id: number;
  requested_by_user_id: number;
  reviewed_by_user_id: number | null;
  name: string;
  chain: string;
  address: string;
  city: string;
  postal_code: string;
  country_code: string;
  currency_code: string;
  latitude: number;
  longitude: number;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  requested_by?: Pick<User, 'id' | 'name' | 'email'>;
  reviewed_by?: Pick<User, 'id' | 'name' | 'email'>;
}

export interface FolderActionItem {
  id: number;
  folder_action_id: number;
  product_id: number | null;
  product_name_raw: string | null;
  promo_price: number;
  normal_price: number | null;
  unit_label: string | null;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface FolderAction {
  id: number;
  store_id: number;
  uploaded_by_user_id: number;
  image_path: string;
  valid_from: string;
  valid_until: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  reviewed_by_user_id: number | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  store?: Store;
  items?: FolderActionItem[];
}
