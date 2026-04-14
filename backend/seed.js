require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const sampleProducts = [
  {
    name: 'Intel Core i9-13900KS',
    description: 'Bộ xử lý Intel Core i9 thế hệ 13, tốn tốc độ cao',
    price: 15000000,
    category: 'CPU',
    stock: 10,
    brand: 'Intel',
    image: 'https://via.placeholder.com/300',
    specifications: {
      'Cores': '24',
      'Threads': '32',
      'Base Clock': '3.0 GHz',
      'Boost Clock': '6.0 GHz',
      'TDP': '150W',
    },
    rating: 4.8,
    numReviews: 120,
    isHot: true,
    isNew: false,
  },
  {
    name: 'NVIDIA RTX 4090',
    description: 'Card đồ họa NVIDIA RTX 4090 hiệu năng cực cao',
    price: 50000000,
    category: 'GPU',
    stock: 5,
    brand: 'NVIDIA',
    image: 'https://via.placeholder.com/300',
    specifications: {
      'VRAM': '24GB GDDR6X',
      'Memory Bus': '384-bit',
      'CUDA Cores': '16384',
      'Boost Clock': '2.52 GHz',
    },
    rating: 4.9,
    numReviews: 250,
    isHot: true,
    isNew: false,
  },
  {
    name: 'Corsair Vengeance RGB Pro 32GB DDR4',
    description: 'RAM DDR4 32GB tốc độ cao với LED RGB',
    price: 3500000,
    category: 'RAM',
    stock: 20,
    brand: 'Corsair',
    image: 'https://via.placeholder.com/300',
    specifications: {
      'Capacity': '32GB (2x16GB)',
      'Speed': '3600MHz',
      'Type': 'DDR4',
      'Latency': 'CAS 18',
    },
    rating: 4.7,
    numReviews: 180,
    isHot: false,
    isNew: false,
  },
  {
    name: 'Samsung 990 Pro 2TB NVMe SSD',
    description: 'Ổ cứng SSD NVMe 2TB tốc độ siêu nhanh',
    price: 4500000,
    category: 'SSD',
    stock: 15,
    brand: 'Samsung',
    image: 'https://via.placeholder.com/300',
    specifications: {
      'Capacity': '2TB',
      'Interface': 'NVMe 4.0',
      'Read Speed': '7100 MB/s',
      'Write Speed': '6000 MB/s',
    },
    rating: 4.8,
    numReviews: 320,
    isHot: true,
    isNew: false,
  },
  {
    name: 'WD Black 4TB HDD',
    description: 'Ổ cứng HDD 4TB dung lượng lớn cho lưu trữ',
    price: 2000000,
    category: 'HDD',
    stock: 25,
    brand: 'Western Digital',
    image: 'https://via.placeholder.com/300',
    specifications: {
      'Capacity': '4TB',
      'RPM': '7200',
      'Cache': '256MB',
      'Interface': 'SATA 3',
    },
    rating: 4.5,
    numReviews: 150,
    isHot: false,
    isNew: false,
  },
  {
    name: 'ASUS ROG STRIX Z790-E Gaming Mainboard',
    description: 'Main socket LGA1700 cho Intel thế hệ 13',
    price: 8000000,
    category: 'Mainboard',
    stock: 12,
    brand: 'ASUS',
    image: 'https://via.placeholder.com/300',
    specifications: {
      'Socket': 'LGA1700',
      'Form Factor': 'ATX',
      'Chipset': 'Z790',
      'RAM Slots': '4',
    },
    rating: 4.7,
    numReviews: 200,
    isHot: true,
    isNew: true,
  },
  {
    name: 'Corsair RM1000x 1000W PSU',
    description: 'Nguồn cấp điện 1000W PFC cao',
    price: 4500000,
    category: 'PSU',
    stock: 8,
    brand: 'Corsair',
    image: 'https://via.placeholder.com/300',
    specifications: {
      'Power': '1000W',
      'Efficiency': '80+ Gold',
      'Modular': 'Full',
      'Warranty': '10 Years',
    },
    rating: 4.8,
    numReviews: 280,
    isHot: true,
    isNew: false,
  },
  {
    name: 'Noctua NH-D15S CPU Cooler',
    description: 'Quạt tản nhiệt CPU hiệu suất cao',
    price: 2500000,
    category: 'Cooling',
    stock: 18,
    brand: 'Noctua',
    image: 'https://via.placeholder.com/300',
    specifications: {
      'Type': 'Air',
      'Socket': 'LGA1700/AM5',
      'Height': '160mm',
      'Max TDP': '250W',
    },
    rating: 4.9,
    numReviews: 350,
    isHot: false,
    isNew: false,
  },
  {
    name: 'Lian Li LANCOOL 3 Mesh Case',
    description: 'Case PC lưới tản nhiệt tốt',
    price: 2000000,
    category: 'Case',
    stock: 20,
    brand: 'Lian Li',
    image: 'https://via.placeholder.com/300',
    specifications: {
      'Form Factor': 'Mid-Tower',
      'Material': 'Steel + Mesh',
      'Fans Included': '3x120mm',
      'GPU Length': 'Up to 320mm',
    },
    rating: 4.6,
    numReviews: 220,
    isHot: false,
    isNew: true,
  },
];

async function seedDatabase() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ ${createdProducts.length} products added to database`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
