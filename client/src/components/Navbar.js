import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-primary text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            City<span className="text-secondary">Threads</span>
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-secondary transition">Home</Link>
            <Link to="/shop" className="hover:text-secondary transition">Shop</Link>
            {user?.role === 'admin' && (
              <Link to="/admin/dashboard" className="hover:text-secondary transition">Admin</Link>
            )}
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/cart" className="relative">
                  <FiShoppingCart size={22} />
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-1">
                    <FiUser size={20} />
                    <span>{user.name.split(' ')[0]}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">My Orders</Link>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-secondary transition">Login</Link>
                <Link to="/register" className="bg-secondary text-primary px-4 py-2 rounded-lg hover:bg-opacity-90 transition">Sign Up</Link>
              </>
            )}
          </div>
          
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
        
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block py-2 hover:text-secondary">Home</Link>
            <Link to="/shop" className="block py-2 hover:text-secondary">Shop</Link>
            {user?.role === 'admin' && (
              <Link to="/admin/dashboard" className="block py-2 hover:text-secondary">Admin</Link>
            )}
            {user ? (
              <>
                <Link to="/cart" className="block py-2 hover:text-secondary">Cart</Link>
                <Link to="/profile" className="block py-2 hover:text-secondary">My Orders</Link>
                <button onClick={logout} className="block w-full text-left py-2 hover:text-secondary">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-secondary">Login</Link>
                <Link to="/register" className="block py-2 hover:text-secondary">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;