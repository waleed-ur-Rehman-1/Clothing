import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI, paymentAPI, orderAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    street: '', city: '', postalCode: '', country: 'Pakistan',
    phoneNumber: '', easypaisaNumber: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
    else fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await cartAPI.get();
      if (!data.items?.length) navigate('/cart');
      setCart(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cart?.items?.reduce((sum, item) => 
    sum + (item.productId.price * item.quantity), 0) || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phoneNumber || !formData.easypaisaNumber) {
      toast.error('Please fill all payment details');
      return;
    }
    setProcessing(true);
    try {
      const payment = await paymentAPI.easypaisa(totalAmount, formData.easypaisaNumber);
      if (payment.data.success) {
        const orderData = {
          shippingAddress: {
            street: formData.street,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country
          },
          phoneNumber: formData.phoneNumber,
          easypaisaTransactionId: payment.data.transactionId,
          paymentStatus: 'Paid'
        };
        await orderAPI.create(orderData);
        toast.success('Order placed successfully!');
        navigate('/profile');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-20 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
          <input type="text" placeholder="Street Address" required className="w-full border rounded-lg p-3" onChange={(e) => setFormData({...formData, street: e.target.value})} />
          <input type="text" placeholder="City" required className="w-full border rounded-lg p-3" onChange={(e) => setFormData({...formData, city: e.target.value})} />
          <input type="text" placeholder="Postal Code" className="w-full border rounded-lg p-3" onChange={(e) => setFormData({...formData, postalCode: e.target.value})} />
          <input type="text" placeholder="Country" value="Pakistan" className="w-full border rounded-lg p-3 bg-gray-50" readOnly />
          <input type="tel" placeholder="Phone Number" required className="w-full border rounded-lg p-3" onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
          
          <h2 className="text-xl font-bold mb-4 mt-6">Easypaisa Payment</h2>
          <input type="tel" placeholder="Easypaisa Mobile Number" required className="w-full border rounded-lg p-3" onChange={(e) => setFormData({...formData, easypaisaNumber: e.target.value})} />
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-600">
            💡 Test mode: Any valid phone number works. Payment will be simulated.
          </div>
          <button type="submit" disabled={processing} className="w-full btn-primary mt-4">
            {processing ? 'Processing...' : `Pay Rs. ${totalAmount.toLocaleString()} via Easypaisa`}
          </button>
        </form>
        
        <div className="bg-gray-50 p-6 rounded-xl h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          {cart?.items?.map((item) => (
            <div key={item.productId._id} className="flex justify-between mb-2 text-sm">
              <span>{item.productId.name} x {item.quantity}</span>
              <span>Rs. {(item.productId.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>Rs. {totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;