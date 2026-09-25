import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, cartAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productAPI.getById(id);
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    try {
      await cartAPI.add(product._id, quantity);
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add');
    }
  };

  if (!product) return <div className="container mx-auto px-4 py-20 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.img initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} src={product.image} alt={product.name} className="w-full rounded-xl shadow-lg" />
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
          <span className="text-primary font-semibold">{product.category}</span>
          <h1 className="text-4xl font-bold mt-2">{product.name}</h1>
          <p className="text-3xl font-bold text-primary mt-4">Rs. {product.price.toLocaleString()}</p>
          <p className="text-gray-600 mt-4">{product.description}</p>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity-1))} className="px-3 py-2 border-r">-</button>
              <span className="px-4 py-2">{quantity}</span>
              <button onClick={() => setQuantity(quantity+1)} className="px-3 py-2 border-l">+</button>
            </div>
            <button onClick={addToCart} className="btn-primary px-8">Add to Cart</button>
          </div>
          <p className="mt-4 text-sm text-green-600">In Stock: {product.stock} units</p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;