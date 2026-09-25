import React, { useEffect, useState } from 'react';
import { productAPI, orderAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('analytics');
  const [productForm, setProductForm] = useState({ name: '', price: '', description: '', category: 'T-Shirts', image: '', stock: 10 });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [analyticsRes, productsRes, ordersRes] = await Promise.all([
        orderAPI.getAnalytics(),
        productAPI.getAll(),
        orderAPI.getAll()
      ]);
      setAnalytics(analyticsRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete product?')) {
      await productAPI.delete(id);
      toast.success('Product deleted');
      fetchData();
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await productAPI.create(productForm);
      toast.success('Product added');
      setProductForm({ name: '', price: '', description: '', category: 'T-Shirts', image: '', stock: 10 });
      fetchData();
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      toast.success('Order status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Admin Dashboard</h1>
      <div className="flex gap-4 mb-8 border-b">
        {['analytics', 'products', 'orders'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-2 px-4 ${activeTab === tab ? 'border-b-2 border-primary text-primary font-bold' : 'text-gray-600'}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'analytics' && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md"><h3>Total Orders</h3><p className="text-3xl font-bold">{analytics.totalOrders}</p></div>
          <div className="bg-white p-6 rounded-xl shadow-md"><h3>Total Products</h3><p className="text-3xl font-bold">{analytics.totalProducts}</p></div>
          <div className="bg-white p-6 rounded-xl shadow-md"><h3>Total Users</h3><p className="text-3xl font-bold">{analytics.totalUsers}</p></div>
          <div className="bg-white p-6 rounded-xl shadow-md"><h3>Revenue</h3><p className="text-3xl font-bold">Rs. {analytics.totalRevenue.toLocaleString()}</p></div>
        </div>
      )}

      {activeTab === 'products' && (
        <div>
          <form onSubmit={handleAddProduct} className="bg-gray-50 p-6 rounded-xl mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Product Name" required className="border p-2 rounded" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} />
            <input type="number" placeholder="Price" required className="border p-2 rounded" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} />
            <input type="text" placeholder="Image URL" required className="border p-2 rounded" value={productForm.image} onChange={(e) => setProductForm({...productForm, image: e.target.value})} />
            <textarea placeholder="Description" required className="border p-2 rounded" value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} />
            <select className="border p-2 rounded" value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})}>
              <option>T-Shirts</option><option>Pants</option><option>Polo Shirts</option><option>Hoodies</option><option>Casual Wear</option>
            </select>
            <input type="number" placeholder="Stock" className="border p-2 rounded" value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value})} />
            <button type="submit" className="btn-primary col-span-full">Add Product</button>
          </form>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl overflow-hidden">
              <thead className="bg-primary text-white"><tr><th className="p-3">Image</th><th>Name</th><th>Price</th><th>Category</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} className="border-b"><td className="p-3"><img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" /></td><td>{p.name}</td><td>Rs. {p.price}</td><td>{p.category}</td><td><button onClick={() => handleDeleteProduct(p._id)} className="text-red-500">Delete</button></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl overflow-hidden">
            <thead className="bg-primary text-white"><tr><th className="p-3">Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Payment</th><th>Action</th></tr></thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-b">
                  <td className="p-3">{order._id.slice(-6)}</td><td>{order.userId?.name || 'N/A'}</td><td>Rs. {order.totalAmount}</td><td>{order.orderStatus}</td><td>{order.paymentStatus}</td>
                  <td><select onChange={(e) => updateOrderStatus(order._id, e.target.value)} className="border rounded p-1" value={order.orderStatus}>
                    <option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option>
                  </select></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;