import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cartAPI } from '../services/api';
import toast from 'react-hot-toast';

const ProductCard = ({ product, index }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const addToCart = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    try {
      await cartAPI.add(product._id, 1);
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl overflow-hidden shadow-md card-hover cursor-pointer"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="h-64 overflow-hidden bg-gray-100">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
      </div>
      <div className="p-4">
        <span className="text-xs text-primary font-semibold">{product.category}</span>
        <h3 className="font-bold text-lg mt-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-2xl font-bold text-primary">Rs. {product.price.toLocaleString()}</span>
          <button onClick={addToCart} className="bg-secondary text-primary px-4 py-2 rounded-lg hover:bg-opacity-90 transition text-sm font-semibold">
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;