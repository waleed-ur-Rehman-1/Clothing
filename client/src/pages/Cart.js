import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await cartAPI.get();
      setCart(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await cartAPI.update(productId, quantity);
      await fetchCart();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const removeItem = async (productId) => {
    try {
      await cartAPI.remove(productId);
      await fetchCart();
      toast.success('Item removed');
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  const totalAmount = cart?.items?.reduce((sum, item) => 
    sum + (item.productId.price * item.quantity), 0) || 0;

  if (loading) return <div className="container mx-auto px-4 py-20 text-center">Loading cart...</div>;
  if (!cart?.items?.length) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
      <button onClick={() => navigate('/shop')} className="btn-primary">Continue Shopping</button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.items.map((item) => (
            <div key={item.productId._id} className="flex flex-col sm:flex-row gap-4 border-b py-4">
              <img src={item.productId.image} alt={item.productId.name} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.productId.name}</h3>
                <p className="text-gray-600">Rs. {item.productId.price.toLocaleString()}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => updateQuantity(item.productId._id, item.quantity - 1)} className="p-1 border rounded"><FiMinus /></button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId._id, item.quantity + 1)} className="p-1 border rounded"><FiPlus /></button>
                  <button onClick={() => removeItem(item.productId._id)} className="text-red-500 ml-4"><FiTrash2 /></button>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold">Rs. {(item.productId.price * item.quantity).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 p-6 rounded-xl h-fit sticky top-20">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>Rs. {totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>Rs. {totalAmount.toLocaleString()}</span>
            </div>
          </div>
          <button onClick={() => navigate('/checkout')} className="w-full btn-primary mt-6">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;