const API_BASE = import.meta.env.VITE_API_URL || '/api';

const getHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('smarthome_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
  total?: number;
  pages?: number;
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`;
  const config: RequestInit = {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers as Record<string, string>),
    },
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }

  return data;
}

export const api = {
  // Auth
  register: (body: { name: string; email: string; password: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  forgotPassword: (email: string) =>
    request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (body: { token: string; password: string }) =>
    request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // Users
  getProfile: () => request('/users/profile'),

  updateProfile: (body: any) =>
    request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  getUsers: () => request('/users'),

  toggleBlockUser: (id: string) =>
    request(`/users/${id}/block`, { method: 'PUT' }),

  updateUser: (id: string, body: any) =>
    request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  deleteUser: (id: string) =>
    request(`/users/${id}`, { method: 'DELETE' }),

  // Products
  getProducts: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/products${query}`);
  },

  getProduct: (idOrHandle: string) => request(`/products/${idOrHandle}`),

  createProduct: (body: any) =>
    request('/products', { method: 'POST', body: JSON.stringify(body) }),

  updateProduct: (id: string, body: any) =>
    request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  deleteProduct: (id: string) =>
    request(`/products/${id}`, { method: 'DELETE' }),

  getAdminProducts: () => request('/products/admin/all'),

  getCategories: () => request('/products/categories'),

  addReview: (productId: string, body: { rating: number; comment: string }) =>
    request(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // Orders
  createOrder: (body: any) =>
    request('/orders', { method: 'POST', body: JSON.stringify(body) }),

  getMyOrders: () => request('/orders/my'),

  getOrder: (id: string) => request(`/orders/${id}`),

  getOrders: () => request('/orders'),

  updateOrderStatus: (id: string, orderStatus: string) =>
    request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ orderStatus }),
    }),
};
