# NexaHome - Smart Home E-commerce Platform

Full-stack MERN e-commerce application for smart home automation devices.

## Tech Stack

**Frontend:**
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui (Radix UI)
- React Router DOM
- TanStack React Query

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Nodemailer (email)

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Backend Setup

```bash
cd server
npm install
```

Edit `server/.env` with your MongoDB URI and SMTP credentials:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/nexahome
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@nexahome.com
FROM_NAME=NexaHome
```

Seed the admin user:
```bash
npm run seed
```

Start the backend:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
# From project root
npm install
npm run dev
```

The frontend runs on `http://localhost:5174` and proxies API requests to the backend.

### 3. Admin Login

Email: `katewinslet@gmail.com`
Password: `@kate123`

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Send reset email
- `POST /api/auth/reset-password` - Reset password

### Products
- `GET /api/products` - List products (with search, filter, pagination)
- `GET /api/products/:id` - Get product by ID or handle
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `GET /api/products/categories` - List categories
- `POST /api/products/:id/reviews` - Add review

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders` - Get all orders (admin)
- `PUT /api/orders/:id/status` - Update order status (admin)

### Users
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users` - List all users (admin)
- `PUT /api/users/:id/block` - Block/unblock user (admin)

## Project Structure

```
osas/
├── server/
│   ├── config/          # DB connection
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth, admin, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── seed/            # Admin seed script
│   ├── templates/email/ # HTML email templates
│   ├── utils/           # Email service
│   ├── server.js        # Entry point
│   └── .env             # Environment variables
├── src/
│   ├── components/      # React components
│   ├── contexts/        # Auth, Cart contexts
│   ├── lib/             # API client utility
│   └── pages/           # Page components
├── package.json
└── vite.config.ts
```

## Email Triggers

- **Registration** → Welcome email
- **Order placement** → Order confirmation with items
- **Order status update** → Status notification to customer
- **Password reset** → Reset token email

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Helmet, CORS, rate limiting
- Role-based access control (user/admin)
- Input validation with express-validator
