import axios from 'axios';
import { 
  Product, 
  Price, 
  Store, 
  ShoppingList, 
  ShoppingListItem,
  LeaderboardEntry,
  Badge,
  StoreRequest,
  FolderAction,
  FolderActionItem
} from '../types/models';

// Configure axios to use CSRF token (only in browser)
if (typeof window !== 'undefined') {
  const token = document.head.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
  if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
  }
}

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Products
export const productApi = {
  search: (query: string, params?: { category?: string }) => 
    api.get<Product[]>('/products/search', { params: { q: query, ...params } }),
  
  findByBarcode: (barcode: string) => 
    api.get<Product>(`/products/barcode/${barcode}`),
  
  create: (data: Partial<Product>) => 
    api.post<Product>('/products', data),
  
  comparePrices: (productId: number, city?: string, countryCode?: string) => 
    api.get(`/products/${productId}/compare`, { params: { city, country_code: countryCode } }),
  
  getCategories: () => 
    api.get<string[]>('/products/categories'),
};

// Prices
export const priceApi = {
  create: (data: { 
    product_id: number; 
    store_id: number; 
    price: number; 
    price_type?: 'normal' | 'promotion';
    normal_price?: number;
    source_type?: 'manual' | 'barcode' | 'receipt' | 'folder';
    proof_image_path?: string;
    is_promotion?: boolean;
    promotion_end_date?: string;
  }) => api.post<{ 
    price: Price; 
    points_earned: number; 
    total_points: number;
    level: number;
  }>('/prices', data),
  
  verify: (priceId: number) => 
    api.post<{ price: Price; points_earned: number }>(`/prices/${priceId}/verify`),
  
  getCityPrices: (city: string, category?: string) => 
    api.get<Price[]>('/prices/city', { params: { city, category } }),
  
  getStatistics: (city?: string) => 
    api.get('/prices/statistics', { params: { city } }),

  uploadProofPhoto: (file: File, sourceType: 'folder' | 'receipt' = 'folder') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('source_type', sourceType);

    return api.post<{ path: string; url: string; source_type: string }>(
      '/prices/proof-upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },
};

// Stores
export const storeApi = {
  getAll: (params?: { city?: string; chain?: string; country_code?: string; currency_code?: string; store_type?: string }) => 
    api.get<Store[]>('/stores', { params }),
  
  getNearby: (latitude: number, longitude: number, radius?: number) => 
    api.get<Store[]>('/stores/nearby', { params: { latitude, longitude, radius } }),
  
  getById: (id: number) => 
    api.get<Store>(`/stores/${id}`),
  
  getCities: () => 
    api.get<string[]>('/stores/cities'),
  
  getChains: () => 
    api.get<string[]>('/stores/chains'),
  
  create: (data: Partial<Store>) => 
    api.post<Store>('/stores', data),
};

// Store requests
export const storeRequestApi = {
  create: (data: {
    name: string;
    chain: string;
    address: string;
    city: string;
    postal_code: string;
    country_code?: string;
    currency_code?: string;
    latitude: number;
    longitude: number;
    admin_notes?: string;
  }) => api.post<{ message: string; store_request: StoreRequest }>('/store-requests', data),

  getAdminRequests: (status: 'pending' | 'approved' | 'rejected' | 'all' = 'pending') =>
    api.get<{ data: StoreRequest[] }>('/admin/store-requests', { params: { status } }),

  approve: (storeRequestId: number, adminNotes?: string) =>
    api.post(`/admin/store-requests/${storeRequestId}/approve`, { admin_notes: adminNotes }),

  reject: (storeRequestId: number, adminNotes?: string) =>
    api.post(`/admin/store-requests/${storeRequestId}/reject`, { admin_notes: adminNotes }),
};

// Folder actions (promotion photos)
export const folderActionApi = {
  create: (data: {
    store_id: number;
    valid_from: string;
    valid_until: string;
    image: File;
  }) => {
    const formData = new FormData();
    formData.append('store_id', String(data.store_id));
    formData.append('valid_from', data.valid_from);
    formData.append('valid_until', data.valid_until);
    formData.append('image', data.image);

    return api.post<{ message: string; folder_action: FolderAction; image_url: string }>(
      '/folder-actions',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  getMine: () => api.get<{ data: FolderAction[] }>('/folder-actions/mine'),

  getById: (id: number) => api.get<FolderAction>(`/folder-actions/${id}`),

  addItem: (folderActionId: number, data: {
    product_id?: number;
    product_name_raw?: string;
    promo_price: number;
    normal_price?: number;
    unit_label?: string;
  }) => api.post<{ message: string; item: FolderActionItem }>(`/folder-actions/${folderActionId}/items`, data),

  getAdmin: (status: 'pending' | 'approved' | 'rejected' | 'all' = 'pending') =>
    api.get<{ data: FolderAction[] }>('/admin/folder-actions', { params: { status } }),

  approve: (folderActionId: number, adminNotes?: string) =>
    api.post(`/admin/folder-actions/${folderActionId}/approve`, { admin_notes: adminNotes }),

  reject: (folderActionId: number, adminNotes?: string) =>
    api.post(`/admin/folder-actions/${folderActionId}/reject`, { admin_notes: adminNotes }),
};

// Shopping Lists
export const shoppingListApi = {
  getAll: () => 
    api.get<ShoppingList[]>('/shopping-lists'),
  
  create: (data: { name: string; city?: string; is_active?: boolean }) => 
    api.post<ShoppingList>('/shopping-lists', data),
  
  getById: (id: number) => 
    api.get<ShoppingList>(`/shopping-lists/${id}`),
  
  update: (id: number, data: Partial<ShoppingList>) => 
    api.put<ShoppingList>(`/shopping-lists/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/shopping-lists/${id}`),
  
  addItem: (listId: number, data: { product_id: number; quantity: number }) => 
    api.post<ShoppingListItem>(`/shopping-lists/${listId}/items`, data),
  
  updateItem: (listId: number, itemId: number, data: Partial<ShoppingListItem>) => 
    api.put<ShoppingListItem>(`/shopping-lists/${listId}/items/${itemId}`, data),
  
  removeItem: (listId: number, itemId: number) => 
    api.delete(`/shopping-lists/${listId}/items/${itemId}`),
  
  compare: (listId: number) => 
    api.get(`/shopping-lists/${listId}/compare`),
  
  optimize: (listId: number) => 
    api.get(`/shopping-lists/${listId}/optimize`),
};

// Gamification
export const gamificationApi = {
  getLeaderboard: (city?: string, limit?: number) => 
    api.get<{ leaderboard: LeaderboardEntry[]; user_rank: number }>('/leaderboard', { 
      params: { city, limit } 
    }),
  
  getProfile: () => 
    api.get('/profile'),
  
  getBadges: () => 
    api.get<{ earned: Badge[]; available: Badge[]; locked: Badge[] }>('/badges'),
};

export default api;
