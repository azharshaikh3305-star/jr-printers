# JR PRINTING WORKS — Full-Stack E-Commerce & Custom Printing Backend

Official production backend and full-stack REST API architecture for **JR PRINTING WORKS** (Proprietor: Shaikh Sameer). Built with **Node.js, Express.js, MongoDB, Mongoose, JWT Authentication, bcryptjs, Nodemailer OTP verification, and Razorpay payment gateway integration**.

---

## 1. Project Architecture & Structure

```
├── backend/                        # Dedicated Backend Architecture (MVC Pattern)
│   ├── config/
│   │   └── db.js                   # Mongoose MongoDB connection & error handling
│   ├── controllers/
│   │   ├── authController.js       # Register, OTP Verify, Resend OTP, Login, Forgot PW
│   │   ├── paymentController.js    # Razorpay order create, crypto signature verify, webhook, refund
│   │   ├── productController.js    # Catalog, categories, search, price calculation
│   │   ├── orderController.js      # Orders CRUD, BlueDart tracking, invoice data
│   │   ├── cartController.js       # Persistent cart synchronization
│   │   ├── inquiryController.js    # Contact leads & WhatsApp quote inquiries
│   │   ├── designController.js     # Saved custom studio designs
│   │   ├── settingsController.js   # Store settings & helpline config
│   │   └── adminController.js      # Admin stats, sales reports, bulk purge
│   ├── models/
│   │   ├── User.js                 # User schema with OTP fields, bcrypt hook, JWT methods
│   │   ├── Product.js              # Catalog schema with price validation & category indexes
│   │   ├── Order.js                # Order schema with Razorpay payment tracking & refunds
│   │   ├── Cart.js                 # Cart line items with virtual subtotal
│   │   ├── Inquiry.js              # Customer quote leads schema
│   │   ├── Design.js               # Saved canvas vector designs schema
│   │   └── Settings.js             # Proprietor info & UPI settings
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth routes
│   │   ├── paymentRoutes.js        # /api/payment routes
│   │   ├── productRoutes.js        # /api/products & /api/categories
│   │   ├── orderRoutes.js          # /api/orders
│   │   ├── cartRoutes.js           # /api/cart
│   │   ├── inquiryRoutes.js        # /api/inquiries
│   │   ├── designRoutes.js         # /api/designs
│   │   ├── settingsRoutes.js       # /api/settings
│   │   └── adminRoutes.js          # /api/admin
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT protect, adminOnly, optionalAuth
│   │   └── errorMiddleware.js      # Centralized 404 & JSON error formatting
│   ├── services/
│   │   └── emailService.js         # Nodemailer SMTP transporter (Verification & Reset OTPs)
│   ├── utils/
│   │   ├── apiResponse.js          # Standardized success/error JSON payloads
│   │   └── generateToken.js        # JWT token issuer
│   ├── data/
│   │   └── seedData.js             # Initial products, sample inquiries, store config
│   ├── seed.js                     # npm run seed execution script
│   ├── server.js                   # Standalone Backend entry point (Port 5000)
│   ├── package.json                # Backend dependency declarations
│   └── .env.example                # Backend environment variables reference
├── src/                            # Frontend Single Page Application (React 19 + Tailwind)
│   ├── services/                   # Clean API Service Layer
│   │   ├── api.ts                  # Axios/Fetch client with Bearer token interceptor
│   │   ├── authService.ts          # Authentication & OTP API client
│   │   ├── paymentService.ts       # Razorpay checkout & payment verification client
│   │   ├── productService.ts       # Products & categories API client
│   │   └── orderService.ts         # Customer & admin orders API client
│   ├── components/                 # UI Components (Auth, Checkout, Designer, Admin)
│   ├── context/                    # AppContext providing auth, cart, orders
│   └── types/                      # TypeScript interfaces
├── server.ts                       # Unified Full-Stack Express + Vite dev server (Port 3000)
├── package.json                    # Root package with unified dev scripts
└── .env.example                    # Root environment variables reference
```

---

## 2. Prerequisites & Environment Setup

- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB Community Edition running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI
- **SMTP Account**: Gmail App Password or custom SMTP for sending real emails (optional in dev mode)
- **Razorpay Account**: Razorpay test Key ID and Secret for INR online checkout (optional in dev mode)

### Environment Variables (`.env`)

Create `.env` in the root and in `backend/` using `.env.example`:

```bash
# Server & Database
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/jr_printing_db
JWT_SECRET=jr_printing_works_jwt_super_secret_key_2026
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000

# Email Service (Nodemailer SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
EMAIL_FROM="JR PRINTING WORKS" <no-reply@jrprinting.in>

# Razorpay Payment Gateway (India)
RAZORPAY_KEY_ID=rzp_test_YourKeyHere
RAZORPAY_KEY_SECRET=YourSecretHere
RAZORPAY_WEBHOOK_SECRET=YourWebhookSecretHere

# Frontend API URL
VITE_API_URL=/api
```

*Note: In development or test mode without SMTP/Razorpay keys, the system logs OTP codes and accepts test payments gracefully so you can develop offline!*

---

## 3. How to Start

### Option A: Unified Full-Stack Mode (Single Command)
Runs Express REST API (`/api/*`) and Vite Frontend on port 3000:

```bash
# 1. Install dependencies
npm install

# 2. Seed default catalog, admin user & store settings
npm run seed

# 3. Start unified dev server
npm run dev
```

### Option B: Standalone Backend + Frontend
Runs Express API on Port 5000 and Frontend on Port 3000:

```bash
# Terminal 1 - Backend Server
cd backend
npm install
npm run seed
npm run dev

# Terminal 2 - Frontend
cd ..
npm run dev
```

---

## 4. API Endpoints

### Authentication & OTP Verification (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user & sends 6-digit Email Verification OTP |
| `POST` | `/api/auth/verify-email-otp` | Public | Verify OTP, activate account, return JWT |
| `POST` | `/api/auth/resend-email-otp` | Public | Resend OTP with 60-second cooldown rate limit |
| `POST` | `/api/auth/login` | Public | Sign in with email/phone & password |
| `POST` | `/api/auth/forgot-password` | Public | Send password reset OTP (protected against account enumeration) |
| `POST` | `/api/auth/verify-reset-otp` | Public | Verify reset OTP |
| `POST` | `/api/auth/reset-password` | Public | Update password and invalidate reset OTP |
| `POST` | `/api/auth/admin-login` | Public | Authenticate owner with Security PIN (`7888`) |
| `GET`  | `/api/auth/me` | Protected | Get authenticated profile |
| `PUT`  | `/api/auth/profile` | Protected | Update profile name, phone, or avatar |

### Payment Gateway & Checkout (`/api/payment`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET`  | `/api/payment/key` | Public | Returns Razorpay Public Key ID safely |
| `POST` | `/api/payment/create-order` | Public | Validates product prices from DB & creates gateway order |
| `POST` | `/api/payment/verify` | Public | Verifies HMAC-SHA256 signature & marks order Paid |
| `POST` | `/api/payment/webhook` | Public | Idempotent webhook handler with HMAC verification |
| `POST` | `/api/payment/refund` | Admin Only | Process refund via Razorpay and update order |

### Products & Categories (`/api/products` & `/api/categories`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET`    | `/api/products` | Public | Get products with search, category & stock filter |
| `GET`    | `/api/products/:id` | Public | Get product details |
| `POST`   | `/api/products` | Admin Only | Add product to catalog |
| `PUT`    | `/api/products/:id` | Admin Only | Update product details |
| `DELETE` | `/api/products/:id` | Admin Only | Remove product |
| `GET`    | `/api/categories` | Public | Get category list with live product counts |

### Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST`   | `/api/orders` | Public | Place order |
| `GET`    | `/api/orders` | Optional/Admin | Get customer's orders (or all if admin) |
| `GET`    | `/api/orders/:orderId` | Public | Get order status by tracking ID |
| `PATCH`  | `/api/orders/:orderId/status` | Admin Only | Update dispatch status & tracking number |
| `DELETE` | `/api/orders/:orderId` | Admin Only | Delete order record |

### Cart (`/api/cart`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET`    | `/api/cart` | Public | Fetch cart items |
| `POST`   | `/api/cart/items` | Public | Add item to cart |
| `PUT`    | `/api/cart/items/:itemId` | Public | Update quantity |
| `DELETE` | `/api/cart/items/:itemId` | Public | Remove item |
| `DELETE` | `/api/cart` | Public | Clear cart |

---

## 5. Security & Verification Features

1. **Backend-Authoritative Pricing**: The checkout endpoint never trusts cart subtotals or prices submitted by the browser. Prices are cross-checked against the MongoDB Product collection.
2. **Cryptographic Signatures**: Razorpay payment verification uses HMAC-SHA256 (`crypto.createHmac('sha256', secret)`).
3. **Password Security**: Passwords hashed with `bcryptjs` salt rounds (10), never stored or returned in plaintext (`select: false`).
4. **OTP Hardening**:
   - 10-minute expiration window.
   - Max 5 incorrect attempts before automatic invalidation.
   - 60-second cooldown rate limiting on resend requests.
   - Immediate invalidation upon successful verification to prevent replay attacks.
   - Protection against user enumeration in the forgot password flow.
5. **Role-Based Authorization**: Middleware ensures only authenticated administrators (`role === 'admin'`) can trigger refunds, delete products, or modify order statuses.

---

## 6. Seed Credentials

- **Admin Account**: `admin@jrprinting.in`
- **Admin Password**: `AdminSuperPassword7888`
- **Admin Security PIN**: `7888`
- **Proprietor Contact**: +91 7888162822 / +91 7888162824
