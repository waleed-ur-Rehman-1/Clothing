import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['T-Shirts', 'Pants', 'Polo Shirts', 'Hoodies', 'Casual Wear'],
    required: true 
  },
  image: { type: String, required: true },
  stock: { type: Number, required: true, default: 10 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', productSchema);