# ShopHub - GraphQL E-Commerce Platform

A modern, full-stack e-commerce platform built with React, GraphQL, Node.js, and MongoDB.

## Project Overview

ShopHub is a complete e-commerce solution featuring:
- **Frontend**: React + TypeScript + Vite with shadcn/ui components
- **Backend**: GraphQL API with Express and GraphQL.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication
- **Features**: Product browsing, shopping cart, order management, admin dashboard
- **Currency**: Indian Rupees (₹)
- **Location**: India

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GraphQL
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Setup environment variables**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

   Required environment variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   PORT=4000
   CORS_ORIGIN=http://localhost:8080
   ```

5. **Create database indexes**
   ```bash
   cd server
   npm run create-indexes
   ```

6. **Seed the database**
   ```bash
   cd server
   npm run seed
   ```
   
   This will create:
   - Admin user (see [Default Credentials](#default-credentials))
   - 5 customer users
   - 6 categories
   - 6 products (one from each category)
   - Sample orders and reviews

7. **Start the development servers**

   Backend (Terminal 1):
   ```bash
   cd server
   npm run dev
   ```

   Frontend (Terminal 2):
   ```bash
   npm run dev
   ```

8. **Access the application**
   - Frontend: http://localhost:8080
   - GraphQL API: http://localhost:4000/graphql

## Default Credentials

### Admin Account
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Role**: Admin (full access to dashboard and management features)

### Customer Accounts
- **Email**: `customer1@example.com` to `customer5@example.com`
- **Password**: `customer123`
- **Role**: Customer

## Project Structure

```
GraphQL/
├── server/                 # Backend GraphQL API
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── models/        # Mongoose models
│   │   ├── schema/        # GraphQL schema & resolvers
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   ├── loaders/       # DataLoader instances
│   │   ├── middleware/    # Express middleware
│   │   └── server.js      # Server entry point
│   └── scripts/           # Database scripts (seed, indexes)
├── src/                   # Frontend React application
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── AuthDialog.tsx
│   │   ├── Cart.tsx
│   │   ├── Navbar.tsx
│   │   └── ProductCard.tsx
│   ├── pages/            # Page components
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Checkout.tsx
│   │   ├── Admin.tsx
│   │   └── NotFound.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── use-cart.tsx
│   │   └── use-graphql.ts
│   └── lib/              # Utilities & GraphQL client
│       ├── graphql-client.ts
│       └── graphql/
└── public/               # Static assets
```

## Features

### Customer Features

#### Product Browsing
- ✅ Browse all products with pagination
- ✅ Filter by category, price range, and search query
- ✅ Sort by price, rating, popularity, or date
- ✅ View product details with images, descriptions, and reviews
- ✅ Real-time search with debouncing
- ✅ Responsive product grid layout

#### Shopping Cart
- ✅ Add products to cart (local + server sync)
- ✅ Remove products from cart
- ✅ Update cart quantities
- ✅ Cart persistence (localStorage)
- ✅ Visual cart indicators (badge with item count)
- ✅ Product in-cart status indicators
- ✅ Real-time cart updates
- ✅ Cart sidebar with item management

#### Authentication & Orders
- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Secure password hashing
- ✅ Order creation and tracking
- ✅ Checkout process (requires authentication)
- ✅ Shipping address management
- ✅ Order history
- ✅ Product reviews and ratings

### Admin Features

#### Dashboard
- ✅ Overview statistics (revenue, products, orders)
- ✅ Visual charts and analytics
- ✅ Recent orders display
- ✅ Quick access to management features

#### Product Management
- ✅ Create, read, update, delete products
- ✅ Product image upload
- ✅ Stock quantity management
- ✅ Category assignment
- ✅ Price management
- ✅ Product status (in stock/out of stock)

#### Category Management
- ✅ Create, update, delete categories
- ✅ Category slug generation
- ✅ Category description and images

#### Order Management
- ✅ View all orders
- ✅ Filter orders by status
- ✅ Update order status
- ✅ Order details view
- ✅ Customer information

#### Security
- ✅ Role-based access control (Admin only)
- ✅ Protected admin routes
- ✅ Authentication verification
- ✅ Authorization checks

## Technologies Used

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Custom GraphQL Client** - GraphQL client with caching and request deduplication
- **shadcn/ui** - Modern UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Sonner** - Toast notifications
- **Lucide React** - Icon library
- **React Query** - Data fetching and caching

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **GraphQL.js** - GraphQL implementation
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **DataLoader** - N+1 query prevention and batching
- **graphql-query-complexity** - Query complexity analysis
- **graphql-depth-limit** - Query depth limiting
- **express-rate-limit** - Rate limiting (production)
- **helmet** - Security headers
- **winston** - Logging
- **zod** - Schema validation

## Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server (http://localhost:8080)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend:**
- `npm run dev` - Start development server with nodemon (http://localhost:4000)
- `npm run start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm run seed:reset` - Reset and seed database
- `npm run create-indexes` - Create database indexes
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## Testing

### Development Test Panel

Use the built-in Development Test Panel (floating button in bottom-right corner) to test all functionality:

- **Authentication Tests**
  - User registration
  - User login
  - Token verification

- **Product Operations**
  - Fetch products
  - Fetch categories
  - Create products (admin)

- **Cart Management**
  - Add to cart
  - Remove from cart
  - Update quantities
  - Server cart sync

- **Order Creation**
  - Create orders
  - Order validation
  - Stock management

- **Admin Operations**
  - Product CRUD
  - Category management
  - Order status updates

### Manual Testing

1. **Authentication**
   - Register a new account
   - Login with existing credentials
   - Access protected routes
   - Logout

2. **Product Browsing**
   - Browse all products
   - Filter by category
   - Filter by price range
   - Search products
   - Sort products
   - View product details

3. **Shopping Cart**
   - Add products to cart
   - Update quantities
   - Remove products
   - View cart total
   - Check cart indicators

4. **Checkout**
   - Add items to cart
   - Navigate to checkout
   - Fill shipping information
   - Place order
   - Verify order creation

5. **Admin Dashboard**
   - Login as admin
   - View dashboard statistics
   - Manage products
   - Manage categories
   - Update order status

## API Documentation

### GraphQL Endpoint

- **URL**: `http://localhost:4000/graphql`
- **Method**: POST (also supports GET)
- **Authentication**: Bearer token in Authorization header

### Key Queries

- `products` - Get products with filtering, pagination, and sorting
- `product(id)` - Get single product by ID
- `categories` - Get all categories
- `orders` - Get user orders (authenticated)
- `cart` - Get user cart (authenticated)
- `me` - Get current user (authenticated)

### Key Mutations

- `register(input)` - Register new user
- `login(input)` - Login user
- `addToCart(productId, quantity)` - Add item to cart
- `removeFromCart(productId)` - Remove item from cart
- `createOrder(input)` - Create new order
- `createProduct(input)` - Create product (admin)
- `updateProduct(id, input)` - Update product (admin)
- `deleteProduct(id)` - Delete product (admin)
- `createCategory(input)` - Create category (admin)
- `updateCategory(id, input)` - Update category (admin)
- `deleteCategory(id)` - Delete category (admin)
- `updateOrderStatus(id, status)` - Update order status (admin)

## Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Protected routes and resolvers
- ✅ Query complexity limiting
- ✅ Query depth limiting
- ✅ Rate limiting (production)
- ✅ CORS configuration
- ✅ Security headers (Helmet)
- ✅ Input validation (Zod)
- ✅ Error handling and logging

## Performance Optimizations

- ✅ DataLoader for N+1 query prevention
- ✅ Database indexing
- ✅ Query caching
- ✅ Request deduplication
- ✅ Request timeout handling
- ✅ Pagination support
- ✅ Field projection optimization
- ✅ Compression middleware

## Recent Updates

### Version 1.0.0
- ✅ Currency changed to Indian Rupees (₹)
- ✅ Country set to India
- ✅ Cart indicators added (badge, in-cart status)
- ✅ Authentication check in checkout
- ✅ Server cart sync for authenticated users
- ✅ Enhanced error handling
- ✅ Improved UI/UX
- ✅ Responsive design improvements
- ✅ All functionalities tested and verified

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify MongoDB URI in `.env` file
   - Check if MongoDB is running
   - Verify network connectivity
   - Check IP whitelist (MongoDB Atlas)

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill process using the port
   - Use different port for frontend/backend

3. **Authentication Errors**
   - Verify JWT_SECRET in `.env`
   - Check token expiration
   - Verify user credentials
   - Clear localStorage and re-login

4. **GraphQL Errors**
   - Check GraphQL endpoint URL
   - Verify query/mutation syntax
   - Check authentication token
   - Review server logs

5. **Product Not Displaying**
   - Verify database seeding
   - Check product data in database
   - Verify GraphQL queries
   - Check browser console for errors

## License

ISC

## Author

**ANSH GUPTA**

---

Built with ❤️ using modern web technologies

## Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Note**: This is a development version. For production deployment, ensure:
- Secure JWT secret
- MongoDB connection string security
- Environment variables configuration
- Rate limiting enabled
- CORS properly configured
- Error logging and monitoring
- Database backups
- SSL/TLS certificates