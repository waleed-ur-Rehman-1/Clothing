import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
};

export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getById: (id) => API.get(`/products/${id}`),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`),
};

export const cartAPI = {
  get: () => API.get('/cart'),
  add: (productId, quantity) => API.post('/cart/add', { productId, quantity }),
  update: (productId, quantity) => API.put('/cart/update', { productId, quantity }),
  remove: (productId) => API.delete(`/cart/remove/${productId}`),
  clear: () => API.delete('/cart/clear'),
};

export const orderAPI = {
  create: (data) => API.post('/orders', data),
  getMyOrders: () => API.get('/orders/myorders'),
  getAll: () => API.get('/orders/admin/all'),
  updateStatus: (id, orderStatus) => API.put(`/orders/admin/${id}/status`, { orderStatus }),
  getAnalytics: () => API.get('/orders/admin/analytics'),
};

export const paymentAPI = {
  easypaisa: (amount, phoneNumber) => API.post('/payment/easypaisa', { amount, phoneNumber }),
};

export default API;