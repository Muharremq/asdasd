// services/api.ts dosyası - ürün depolama sorunu düzeltildi ve yeni ürünler eklendi

import { Product, Cart, CartItem, Wishlist, WishlistItem, Order, OrderStatus, Review, User, UserRole, SupportTicket, TicketStatus } from '../types';

// Local storage keys - ortak ürün deposu için tek bir anahtar 
const AUTH_USER_KEY = 'auth_user';
const CART_KEY = 'cart_items';
const WISHLIST_KEY = 'wishlist_items';
const PRODUCTS_KEY = 'shop_products'; // Global ürün deposu anahtarı
const ORDERS_KEY = 'shop_orders'; // Siparişler için anahtar

// Mock kullanıcılar
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123', // Gerçek uygulamada hash'lenirdi
    role: UserRole.BUYER,
    phone: '+1234567890',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    }
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: UserRole.SELLER,
    phone: '+9876543210'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: UserRole.ADMIN
  }
];

// İlk kez yüklenen örnek ürünler - Genişletilmiş ürün listesi
const initialProducts: Product[] = [
  // Elektronik Kategorisi
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with high-quality sound. Features include 30-hour battery life and comfortable over-ear design.',
    price: 199.99,
    image: 'https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Electronics',
    stock: 15,
    sellerId: '2',
    rating: 4.5,
    reviewCount: 120
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and smartphone notifications.',
    price: 149.99,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Electronics',
    stock: 25,
    sellerId: '2',
    rating: 4.2,
    reviewCount: 85
  },
  {
    id: '3',
    name: '4K Ultra HD Smart TV - 55"',
    description: 'Crystal clear 4K resolution, smart features, and HDR support for the ultimate viewing experience.',
    price: 699.99,
    image: 'https://images.pexels.com/photos/6976094/pexels-photo-6976094.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Electronics',
    stock: 10,
    sellerId: '2',
    rating: 4.7,
    reviewCount: 65
  },
  {
  id: '4',
  name: 'Fitness Tracker',
  description: 'Monitor your heart rate, steps, sleep, and more with this water-resistant fitness tracker. Syncs with your smartphone for detailed health analytics.',
  price: 89.99,
  image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQM2_5eRcac2HT-Da5CBb7YFnmjy7rdsOddsm1pGU3bHIYCmlrBQ24gq_M9ajuSGlIToj3Q_Oebt4qmnhDYTPJ5P_JzmMIamAytutZyp8vQJ2mrFLE_4g9-9A',
  category: 'Electronics',
  stock: 20,
  rating: 4.6,
  reviewCount: 150
},
{
  id: '5',
  name: 'Smart Speaker',
  description: 'Voice-controlled smart speaker with premium sound quality. Control your smart home, play music, set reminders, and more.',
  price: 149.99,
  image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRyZLi1mdXQ-LJod15ykHx-_MRwfLAFctcFp5ikc9TV4gxOewC5BU3NzCSgHgczfjCGYlP7htg8R1YFFHUdo2YsB9C8rSkbNxcghJfOsoiDX88KSrKwPPgJptcL',
  category: 'Electronics',
  stock: 12,
  rating: 4.5,
  reviewCount: 78
},

// Home Appliances Kategorisi
{
  id: '6',
  name: 'Coffee Maker',
  description: 'Programmable coffee maker with thermal carafe to keep your coffee hot for hours. Features include auto-shutoff and brew strength control.',
  price: 79.99,
  image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQTQxVVMiBQZjujOkHTOLQz1MtZ5dTS728GazfkmGOdXFvGs7royN2y8vA89XM70MlXT0HBy0D973-vKtflmW1Yqs9KQLKM0A',
  category: 'Home Appliances',
  stock: 12,
  rating: 4.0,
  reviewCount: 65
},
{
  id: '7',
  name: 'Blender',
  description: 'High-powered blender for smoothies, soups, and more. Includes multiple speed settings and dishwasher-safe components.',
  price: 69.99,
  image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQmu5eRsXsMI_mJkouOmmoti_9klKUu1oi5c0FNNOw_loVPW4ACKPrR1RQVP1hdIqjffuXTqgu_0To0qNmwSDTfK1MmHd03MEaquM1TSPeU06-2uvSv9rNL',
  category: 'Home Appliances',
  stock: 18,
  rating: 4.4,
  reviewCount: 57
},
{
  id: '8',
  name: 'Air Fryer',
  description: 'Healthy cooking with little to no oil. This air fryer cooks food quickly and evenly with much less fat than traditional frying methods.',
  price: 119.99,
  image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTEv-qblGsgnv_1tzdTJPVJvAFoKJlCL-tyi_YZYdJwaeSFHdjydbw-onbbOSAAsTPqed8yKUixIRNN_T38PztnPlPsNZmO',
  category: 'Home Appliances',
  stock: 10,
  rating: 4.7,
  reviewCount: 92
},
{
  id: '9',
  name: 'Robot Vacuum Cleaner',
  description: 'Smart robot vacuum with mapping technology and app control. Schedule cleanings, set no-go areas, and let it automatically clean your home.',
  price: 299.99,
  image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTtvSy1bxYpZJxy1Vq2oEH7HPLzp1yH_xD__g3KSRMdFbXIpFdqxlolyXYTq9BJyUVRbR_iPj_RKzRlbS8-9t5QPutE4E2AwhfowW09J1ztcM-ww0aqsmW-Mg',
  category: 'Home Appliances',
  stock: 7,
  rating: 4.3,
  reviewCount: 43
},

// Accessories Kategorisi
{
  id: '10',
  name: 'Laptop Backpack',
  description: 'Durable backpack with padded compartments for your laptop and accessories. Water-resistant material and anti-theft features.',
  price: 49.99,
  image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRz5BoP-mlrhfmXJXRJ0s13-aINvCnSgkNVC8l1x8c8BZOMk0KK6TIvF7vmR_xS8nrztCa9eSPEjKSsFfQN2H-QgevONzCekw8LCo8pzQzD',
  category: 'Accessories',
  stock: 50,
  rating: 4.8,
  reviewCount: 200
},
{
  id: '11',
  name: 'Phone Case',
  description: 'Protective phone case with shock-absorbing technology. Available for various phone models with precise cutouts for buttons and ports.',
  price: 19.99,
  image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcS3cVxt1RpzkpDeA8Cw6lysVq-r3T3lnXNEJwfPHHbJRiqm8zaUEfwZ0SfEd4RC53mwsUnoptaPwPq1O7JR8dTqL7Mj5Qt5IYjoB6lEZKo_CnQoI1rRGhChEno',
  category: 'Accessories',
  stock: 100,
  rating: 4.5,
  reviewCount: 180
},
{
  id: '12',
  name: 'Wireless Earbuds',
  description: 'Compact wireless earbuds with noise cancellation and touch controls. Comes with charging case for 24+ hours of battery life.',
  price: 129.99,
  image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRKYbyZ4uh1D_7UBUsWOdG88-m4zbS8AKhcU0uVWWLB4dEAYPGa1ZF3gMzNGst7aj1C8FTS6AEirH9QsnxKoVnSUWNZzdmx',
  category: 'Accessories',
  stock: 25,
  rating: 4.6,
  reviewCount: 75
},
{
  id: '13',
  name: 'Laptop Stand',
  description: 'Adjustable laptop stand for better ergonomics. Helps reduce neck and back strain with multiple height options.',
  price: 29.99,
  image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSJJ3RlH2hdy_lLb2pxzerWaDngamEspkrk7TcR59nRqjUmzvXOQ0a83c8cP6ZmdThw7SZbDL7jXCVxLgvWNvqWzkoIYDkyYmjP4oQK47E',
  category: 'Accessories',
  stock: 40,
  rating: 4.4,
  reviewCount: 62
},

// Fashion Kategorisi
{
  id: '14',
  name: 'Classic Wristwatch',
  description: 'Elegant analog wristwatch with leather strap. Water-resistant design with date display and mineral glass face.',
  price: 89.99,
  image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQaxnhkXtVsjDKbjZpbSfh41ywJjcFmkthkQu1XxNQFAyvKMeFuyMLO8hS3uez0A44p4rHCk5XAxwoI0p6T8oKkxIW8NNlmy9ZerHqhr3FxnL-UJIXm7sxNEQ',
  category: 'Fashion',
  stock: 15,
  rating: 4.7,
  reviewCount: 48
},
{
  id: '15',
  name: 'Leather Wallet',
  description: 'Genuine leather wallet with multiple card slots and bill compartments. RFID blocking technology for security.',
  price: 39.99,
  image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTBjzl5GOpleXZq0G6Ete01_MnIgQRSVZJNoabbhdc8N5Q1d3HxEIqtKcG0Z1JNJyeUzQGu98VmWk8qiWMPa5sUZPg_AR6ReAU1oVaG_I6jhDala-b5Bs3NwQ',
  category: 'Fashion',
  stock: 30,
  rating: 4.5,
  reviewCount: 55
},
{
  id: '16',
  name: 'Sunglasses',
  description: 'Polarized sunglasses with UV protection. Stylish design with durable metal frame and comfortable fit.',
  price: 59.99,
  image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTw5joAEm3nAxGcqlFPsP3WhVH7OjaifeV1fSsO-zuGG62yELsWpPLi1XzIAEQ3IRoJTovRy5emEvSj6T19iYju2gVmfHPLKbbmTRkfHzWtAnajpvye7sObCg',
  category: 'Fashion',
  stock: 45,
  rating: 4.3,
  reviewCount: 87
},
{
  id: '17',
  name: 'Casual Sneakers',
  description: 'Comfortable casual sneakers for everyday wear. Lightweight with cushioned soles for all-day comfort.',
  price: 69.99,
  image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTKJZOMjLP_UrwUJoRhrCOKJeqNk9w76SwhufxkmMi_hHnmghdOJtJlg4DcapcWPZSHAwp_0wfef0GKjHk_2OBBkqejCfa0qWDCVz8Dbz8kzi1-KQW1blRpiQ',
  category: 'Fashion',
  stock: 20,
  rating: 4.4,
  reviewCount: 65
},

// Books Kategorisi
{
  id: '18',
  name: 'Productivity Guide',
  description: 'Bestselling book on maximizing your productivity and creating effective work habits. Learn techniques used by top performers.',
  price: 16.99,
  image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSRQShl4puwg9LERx1qLNLxUZf_gtfUGOpWUMfXHx_yMwP6HdIZyoHStDqv_WaEOaeFjWob6EIH_pLV6syzJH_M64H8w3FgDWF7JE5Cf2laLoMa86d_8vIi1g',
  category: 'Books',
  stock: 50,
  rating: 4.6,
  reviewCount: 112
},
{
  id: '19',
  name: 'Cookbook Collection',
  description: 'Collection of recipes from around the world. Includes step-by-step instructions and beautiful photography for each dish.',
  price: 24.99,
  image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR7gauoN4PgFr3x83RlBnWhilngt3vw07Gc7vELbsB78C_dytkfHuCbiCWQWAiGON4lKg6aawryT-hSFI15pkNhZXoguzZFZCPEeCCb4_4T',
  category: 'Books',
  stock: 35,
  rating: 4.8,
  reviewCount: 79
},
{
  id: '20',
  name: 'Fiction Bestseller',
  description: 'Award-winning novel that tops the bestseller lists. A compelling story of adventure and personal discovery.',
  price: 14.99,
  image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcT3aT0TfHaD32JD9AkBIEDOiKX7EHXD5qXMsHF_nqBg1AgF9mg4NOmVKVPdrqWd_5DV0AdsHCLPHvpT7xSBdOBQIWy1J3UM_A',
  category: 'Books',
  stock: 60,
  rating: 4.5,
  reviewCount: 203
},

// Sports & Outdoors Kategorisi
{
  id: '21',
  name: 'Yoga Mat',
  description: 'Non-slip yoga mat with alignment marks. Perfect thickness for joint protection and comfortable practice.',
  price: 29.99,
  image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRxkK5rCmqB5tiTj2wD6kk-vNOmAbUOQugmpDSnlSqzxsrkJTGRlyQggifFtOirm9wdpk0PG54pNotSUjbNwBABWyma7JfsES_5xtplhn0PiMLS9mBOs71CCg',
  category: 'Sports & Outdoors',
  stock: 40,
  rating: 4.7,
  reviewCount: 95
},
{
  id: '22',
  name: 'Water Bottle',
  description: 'Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours. Leak-proof design with easy-carry handle.',
  price: 24.99,
  image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcT6CVlu_st_WDB0w-x6cLDkezPr5UjHvkO6yT7wOtifH6Ffpw5FWhRivP-O3k1aL96EN17ISLaXZ6Hh2fugMEZ1BP2z0nm843Lyhi4wRdZdkYHuDWmixYJIiA',
  category: 'Sports & Outdoors',
  stock: 75,
  rating: 4.6,
  reviewCount: 108
},
{
  id: '23',
  name: 'Hiking Backpack',
  description: 'Durable hiking backpack with multiple compartments and hydration compatibility. Comfortable padded straps and back support.',
  price: 79.99,
  image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQYEzxdKNdz6tp3NNuP27mtERn_URf12aFSMDhisLZ8ViyYypQZR2yTPMjmyDbeJ_1eLLljSJ9F2Th9hwKaA_Sz3KBKYTaMD_ckujs9qqcodPhqkqA5EIMhC8g',
  category: 'Sports & Outdoors',
  stock: 25,
  rating: 4.5,
  reviewCount: 67
},

// Beauty & Personal Care Kategorisi
{
  id: '24',
  name: 'Skincare Set',
  description: 'Complete skincare set with cleanser, toner, moisturizer, and serum. Made with natural ingredients for all skin types.',
  price: 49.99,
  image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQvRwCycQNLEBKTfFGWfDu1MFWAeKLCL3dV6YVo0SKcc0nts-8Oms-xO8gLqJCQ0inGBMrzKpwKpmMVfhbZQxrbf_vA1S89p02z2jYyMC3TduFjUJY6Ae8VlQ',
  category: 'Beauty & Personal Care',
  stock: 30,
  rating: 4.7,
  reviewCount: 82
},
{
  id: '25',
  name: 'Hair Dryer',
  description: 'Professional-grade hair dryer with multiple heat and speed settings. Includes concentrator and diffuser attachments.',
  price: 59.99,
  image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR1DoUjQpn4b57k5svlKOIuK42YfKYI0AEdr3CPVMRoCyGz5idGUjXzZSSa3L-0xMiAncWovMTqD50WDwXArOY6_kx28nlUElmIO-4t4TgZT1HbXEzcs_hi2w',
  category: 'Beauty & Personal Care',
  stock: 22,
  rating: 4.4,
  reviewCount: 56
},
{
  id: '26',
  name: 'Electric Toothbrush',
  description: 'Rechargeable electric toothbrush with multiple cleaning modes. Timer ensures proper brushing time for optimal oral hygiene.',
  price: 69.99,
  image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcT87toph-v_zYwMsZ2ejg3d7z0PkpNDi3VvdT8O70NVhu3lyeV3IDLaFteEYMF5BKy7J-yPQuOS0nqpzLHZ-2EeGa5gMEHvk9iBtorH6GCjpSQ3MhXfuPrg7A',
  category: 'Beauty & Personal Care',
  stock: 18,
  rating: 4.6,
  reviewCount: 73
},

// Home Decor Kategorisi
{
  id: '27',
  name: 'Decorative Pillows',
  description: 'Set of 2 decorative throw pillows with removable covers. Adds comfort and style to any living space.',
  price: 34.99,
  image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQgIFq4zu_88RdIwcsZ_Ar262UQWpbIaVwuuklkRG9_aYdRPoT-ZsHt5K5kEoJ53Py9LP7Nc6zkoLLk2oErIjnojDDYSk7JixuyFIIj06xnLYoXvrYwCPfpug',
  category: 'Home Decor',
  stock: 45,
  rating: 4.5,
  reviewCount: 63
},
{
  id: '28',
  name: 'Wall Art Print',
  description: 'Modern wall art print perfect for living room or bedroom. Printed on high-quality canvas with wooden frame.',
  price: 39.99,
  image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSIBoULUh7Bxgi4O2OdTTPoYzbfM7_IA9rlwWa-wd6CK7vnCVCYp9gwuoZ66kPlT0Kg8bxfnOmgEcW1szWBLtJ8JqDOFF9W1UJvoHRc_WqN7ON7pGCxkjTSsg',
  category: 'Home Decor',
  stock: 30,
  rating: 4.7,
  reviewCount: 48
},
{
  id: '29',
  name: 'Table Lamp',
  description: 'Stylish table lamp with adjustable brightness. Perfect for bedside tables or home office desks.',
  price: 44.99,
  image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQn19vpoGh0R9Uhet72wr2VBl75NNC7t6Z7xREi3xp7e4Bp12AjHOAQ_r2X7us1xqiHfMy_kZdJkuWdKHlt5eyKOwoH3OnqsfR7zLX1lMZwTYvfSg1UUxW7',
  category: 'Home Decor',
  stock: 25,
  rating: 4.4,
  reviewCount: 39
},

// Toys & Games Kategorisi
{
  id: '30',
  name: 'Board Game Set',
  description: 'Family board game set with multiple classic games. Perfect for family game nights and gatherings.',
  price: 29.99,
  image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRRZOnWPn0fZFuNDsH5nofhZL7xaYijgq8VJoFTR3mKdFHBv8Q42v3k1FinSokcevIzzGSo6AR7tRYu2rLu5K32ncuna_oysslLpPw6gpMbK-BHIT8MxlWe',
  category: 'Toys & Games',
  stock: 35,
  rating: 4.6,
  reviewCount: 87
},
{
  id: '31',
  name: 'Remote Control Car',
  description: 'High-speed remote control car with durable construction. Can drive on various terrains with responsive controls.',
  price: 49.99,
  image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcS7p_fHqIj4zKue5Nf4V7e7kTPh7E9Iyt4Oii0CVBdC8kds9TkWEYg_-5_20CtnQoeRtMWTF1pa1-st7HMtFnulkLUv3bW3_UcajX21zBHHy7sOYui9DE3O4g',
  category: 'Toys & Games',
  stock: 20,
  rating: 4.5,
  reviewCount: 54
},
{
  id: '32',
  name: 'Building Blocks Set',
  description: 'Creative building blocks set with 500+ pieces. Compatible with major brands for endless building possibilities.',
  price: 39.99,
  image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSJa0plUmvOR5hgjZEsIIwJY9u-LeDy3CreZubzHnSX3k_xP-eU3gxbInJe40QxFEMS7qNOK-AATLFTPtTWO3MOHHrZd6Dm_AtrWDjU-lzExxF0lfbGTzTjww',
  category: 'Toys & Games',
  stock: 40,
  rating: 4.8,
  reviewCount: 112
}
];

// Dinamik ürün listesi
let dynamicProducts = [...initialProducts];

// Global ürün deposunu başlatma ve alma fonksiyonları
const initializeProducts = () => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
};

initializeProducts();

const getProducts = (): Product[] => {
  const productsJson = localStorage.getItem(PRODUCTS_KEY);
  if (productsJson) {
    return JSON.parse(productsJson);
  }
  return [];
};

const saveProducts = (products: Product[]) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

// Sipariş yardımcı fonksiyonları
const loadOrders = (): Order[] => {
  const ordersJson = localStorage.getItem(ORDERS_KEY);
  if (ordersJson) {
    return JSON.parse(ordersJson);
  }
  return [];
};

const saveOrders = (orders: Order[]) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // API gecikmesi simülasyonu
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Şifreyi kullanıcı verisinden silerek döndür
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  },

  register: async (name: string, email: string, password: string, role: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (mockUsers.some(u => u.email === email)) {
      throw new Error('Email already exists');
    }
    
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      name,
      email,
      password,
      role: role as UserRole
    };
    
    mockUsers.push(newUser);
    
    // Şifreyi kullanıcı verisinden silerek döndür
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  },

  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.removeItem(AUTH_USER_KEY);
  },

  getCurrentUser: () => {
    const userJson = localStorage.getItem(AUTH_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },

  updateProfile: async (userId: string, updates: Partial<User>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');
    
    const updatedUser = { ...mockUsers[userIndex], ...updates };
    mockUsers[userIndex] = updatedUser;
    
    // Şifreyi kullanıcı verisinden silerek döndür
    const { password: _, ...userWithoutPassword } = updatedUser;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  }
};

// Product API
export const productApi = {
  getProducts: async (filters?: any) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filteredProducts = [...dynamicProducts];
    
    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(searchLower) || 
          product.description.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.category) {
        filteredProducts = filteredProducts.filter(product => 
          product.category.toLowerCase() === filters.category.toLowerCase()
        );
      }
      
      if (filters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => 
          product.price >= filters.minPrice
        );
      }
      
      if (filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => 
          product.price <= filters.maxPrice
        );
      }
      
      if (filters.sortBy) {
        filteredProducts.sort((a, b) => {
          if (filters.sortBy === 'price') {
            return filters.sortOrder === 'desc' ? b.price - a.price : a.price - b.price;
          } else if (filters.sortBy === 'rating') {
            return filters.sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
          } else if (filters.sortBy === 'newest') {
            return filters.sortOrder === 'desc' ? 
              parseInt(b.id) - parseInt(a.id) : 
              parseInt(a.id) - parseInt(b.id);
          }
          return 0;
        });
      }
    }
    
    return filteredProducts;
  },

  getProduct: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const product = dynamicProducts.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  },

  addProduct: async (productData: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newProduct: Product = {
      ...productData,
      id: (dynamicProducts.length + 1).toString(),
      rating: 0,
      reviewCount: 0
    };
    
    dynamicProducts.push(newProduct);
    return newProduct;
  },

  updateProduct: async (id: string, updates: Partial<Product>) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = dynamicProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    
    dynamicProducts[index] = { ...dynamicProducts[index], ...updates };
    return dynamicProducts[index];
  },

  deleteProduct: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const initialLength = dynamicProducts.length;
    dynamicProducts = dynamicProducts.filter(p => p.id !== id);
    
    if (dynamicProducts.length === initialLength) {
      throw new Error('Product not found');
    }
    
    return { success: true };
  }
};

// Cart API
export const cartApi = {
  getCart: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const cartItems: CartItem[] = [];
    let subtotal = 0;
    
    // Demo amaçlı basit bir sepet oluştur
    const product = dynamicProducts[0];
    if (product) {
      const cartItem: CartItem = {
        productId: product.id,
        product,
        quantity: 1
      };
      cartItems.push(cartItem);
      subtotal += product.price;
    }
    
    const tax = subtotal * 0.08; // %8 vergi
    const total = subtotal + tax;
    
    return {
      items: cartItems,
      subtotal,
      tax,
      total
    };
  },

  addToCart: async (productId: string, quantity: number) => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const product = dynamicProducts.find(p => p.id === productId);
    if (!product) throw new Error('Product not found');
    
    if (product.stock < quantity) {
      throw new Error('Not enough stock');
    }
    
    // Gerçek bir uygulamada, bu bir veritabanı veya local storage'ı güncellerdi
    return {
      items: [
        {
          productId,
          product,
          quantity
        }
      ],
      subtotal: product.price * quantity,
      tax: product.price * quantity * 0.08,
      total: product.price * quantity * 1.08
    };
  },

  updateCartItem: async (productId: string, quantity: number) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const product = dynamicProducts.find(p => p.id === productId);
    if (!product) throw new Error('Product not found');
    
    if (product.stock < quantity) {
      throw new Error('Not enough stock');
    }
    
    return {
      items: [
        {
          productId,
          product,
          quantity
        }
      ],
      subtotal: product.price * quantity,
      tax: product.price * quantity * 0.08,
      total: product.price * quantity * 1.08
    };
  },

  removeFromCart: async (productId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0
    };
  },

  clearCart: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0
    };
  }
};

// Wishlist API
export const wishlistApi = {
  getWishlist: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const wishlistItems: WishlistItem[] = [];
    
    // Demo amaçlı örnek bir istek listesi öğesi ekle
    const product = dynamicProducts[1];
    if (product) {
      const wishlistItem: WishlistItem = {
        id: '1',
        userId: '1',
        productId: product.id,
        product,
        addedAt: new Date().toISOString()
      };
      wishlistItems.push(wishlistItem);
    }
    
    return {
      items: wishlistItems
    };
  },

  addToWishlist: async (productId: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const product = dynamicProducts.find(p => p.id === productId);
    if (!product) throw new Error('Product not found');
    
    const wishlistItem: WishlistItem = {
      id: Math.random().toString(),
      userId: '1', // Demo için sabit bir kullanıcı ID'si kullanılıyor
      productId,
      product,
      addedAt: new Date().toISOString()
    };
    
    return {
      items: [wishlistItem]
    };
  },

  removeFromWishlist: async (productId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      items: []
    };
  }
};

// Review API
export const reviewApi = {
  getProductReviews: async (productId: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Örnek değerlendirmeler oluştur
    return [
      {
        id: '1',
        userId: '1',
        userName: 'John Doe',
        productId,
        rating: 5,
        comment: 'Excellent product! Exceeded my expectations.',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 gün önce
      },
      {
        id: '2',
        userId: '2',
        userName: 'Jane Smith',
        productId,
        rating: 4,
        comment: 'Very good quality, but shipping took longer than expected.',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // 14 gün önce
      }
    ];
  },

  createReview: async (productId: string, userId: string, userName: string, rating: number, comment: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const product = dynamicProducts.find(p => p.id === productId);
    if (!product) throw new Error('Product not found');
    
    // Gerçek bir uygulamada, bu bir veritabanını güncellerdi
    // ve ürünün puanını yeniden hesaplardı
    return {
      id: Math.random().toString(),
      userId,
      userName,
      productId,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };
  }
};

// Order API
export const orderApi = {
  getOrders: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Örnek siparişler oluştur
    return [
      {
        id: '1',
        userId,
        items: [
          {
            productId: '1',
            productName: 'Wireless Headphones',
            price: 199.99,
            quantity: 1,
            image: dynamicProducts[0].image
          }
        ],
        status: OrderStatus.DELIVERED,
        subtotal: 199.99,
        tax: 16.00,
        total: 215.99,
        shippingAddress: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          country: 'USA'
        },
        paymentMethod: 'credit_card',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 gün önce
        trackingNumber: 'TRK123456789',
        estimatedDelivery: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() // 25 gün önce (çoktan teslim edilmiş)
      },
      {
        id: '2',
        userId,
        items: [
          {
            productId: '2',
            productName: 'Smart Fitness Watch',
            price: 149.99,
            quantity: 1,
            image: dynamicProducts[1].image
          }
        ],
        status: OrderStatus.SHIPPED,
        subtotal: 149.99,
        tax: 12.00,
        total: 161.99,
        shippingAddress: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          country: 'USA'
        },
        paymentMethod: 'paypal',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 gün önce
        trackingNumber: 'TRK987654321',
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 gün sonra
      }
    ];
  },

  cancelOrder: async (orderId: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const orders = loadOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) throw new Error('Order not found');
    if (orders[orderIndex].status === OrderStatus.DELIVERED) {
      throw new Error('Cannot cancel delivered order');
    }
    
    orders[orderIndex].status = OrderStatus.CANCELLED;
    orders[orderIndex].updatedAt = new Date().toISOString();
    
    saveOrders(orders);
    return orders[orderIndex];
  }
};

// Support Ticket API
export const supportApi = {
  createTicket: async (userId: string, userName: string, subject: string, message: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newTicket: SupportTicket = {
      id: Math.random().toString(),
      userId,
      userName,
      subject,
      message,
      status: TicketStatus.OPEN,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return newTicket;
  },

  getTickets: async (userId?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Örnek destek talepleri oluştur
    const tickets: SupportTicket[] = [
      {
        id: '1',
        userId: '1',
        userName: 'John Doe',
        subject: 'Order Delivery Issue',
        message: 'My order #1 was supposed to arrive yesterday but I still haven\'t received it.',
        status: TicketStatus.OPEN,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 gün önce
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        userId: '2',
        userName: 'Jane Smith',
        subject: 'Refund Request',
        message: 'I would like to request a refund for my recent purchase as the item was damaged.',
        status: TicketStatus.IN_PROGRESS,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 gün önce
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 gün önce
      }
    ];
    
    if (userId) {
      return tickets.filter(ticket => ticket.userId === userId);
    }
    return tickets;
  },

  updateTicketStatus: async (ticketId: string, status: TicketStatus) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      id: ticketId,
      status,
      updatedAt: new Date().toISOString()
    };
  }
};

// Kategoriler
export const mockCategories = [
  'Electronics',
  'Books',
  'Fashion',
  'Shoes',
  'Home & Kitchen',
  'Sports',
  'Health & Beauty'
];