# ListingHouse - Property Rental Platform

A full-stack MERN (MongoDB, Express, React, Node.js) application for property listings and bookings with integrated payment processing.

## 🚀 Features

- **User Authentication**: JWT-based authentication with 24-hour session expiry
- **Property Listings**: Create, read, update, and delete property listings
- **Image Management**: Multiple image uploads with Cloudinary integration
- **Booking System**: Create and manage property bookings with status tracking
- **Payment Integration**: Stripe payment gateway for secure transactions
- **Review System**: Users can leave reviews and ratings for properties
- **Wishlist**: Save favorite properties for later viewing
- **Email Notifications**: Automated booking confirmation emails
- **Admin Panel**: Admin users can manage all listings and bookings
- **CSV Export**: Export listing data to CSV format
- **Map Integration**: Location-based property search with coordinates

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Frontend Structure](#frontend-structure)
- [Backend Structure](#backend-structure)

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Toastify** - Notifications

### Backend
- **Node.js** with Express
- **TypeScript**
- **MongoDB** with Mongoose
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage
- **Stripe** - Payment processing
- **Nodemailer** - Email service
- **Multer** - File uploads

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup

```bash
cd Backend
npm install

# Create .env file with required variables (see Environment Variables section)

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd Frontend
npm install

# Start development server
npm run dev
```

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=3000
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# Email (OAuth2)
EMAIL_USER=your_email@gmail.com
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REFRESH_TOKEN=your_google_refresh_token

# Frontend URL
VITE_FRONTEND_BASE_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 📊 Database Schema

### User Model

```typescript
{
  username: String (required, unique)
  email: String (required, unique)
  password: String (required, hashed)
  admin: Boolean (default: false)
  createdAt: Date
  updatedAt: Date
}
```

### Listing Model

```typescript
{
  title: String (required)
  description: String
  price: Number (required)
  category: String
  location: String (required)
  images: [String] (required)
  geometry: {
    coordinates: [Number] (longitude, latitude)
  }
  owner: ObjectId (ref: User, required)
  reviews: [ObjectId] (ref: Review)
  createdAt: Date
  updatedAt: Date
}
```

### Booking Model

```typescript
{
  listing: ObjectId (ref: Listing, required)
  customer: ObjectId (ref: User, required)
  checkIn: Date (required)
  checkOut: Date (required)
  guests: Number (required)
  totalPrice: Number (required)
  stayDay: Number (required)
  status: String (enum: ['pending', 'confirmed', 'cancelled'], default: 'pending')
  isPaid: Boolean (default: false)
  createdAt: Date
  updatedAt: Date
}
```

### Review Model

```typescript
{
  listing: ObjectId (ref: Listing, required)
  user: ObjectId (ref: User, required)
  rating: Number (required, 1-5)
  comment: String (required)
  createdAt: Date
  updatedAt: Date
}
```

### Like Model

```typescript
{
  listing: ObjectId (ref: Listing, required)
  user: ObjectId (ref: User, required)
  createdAt: Date
}
```

## 🔌 API Endpoints

### Authentication

#### Register User
```http
POST /api/user/register
Content-Type: application/json

Request Body:
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
{
  "user": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "admin": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token",
  "message": "User created Successfully"
}
```

#### Login User
```http
POST /api/user/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "user": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "admin": false
  },
  "token": "jwt_token",
  "message": "User logged in Successfully"
}
```

#### Logout User
```http
POST /api/user/logout
Authorization: Bearer {token}

Response (200):
{
  "message": "User logged out Successfully"
}
```

#### Get Current User
```http
GET /api/user/me
Authorization: Bearer {token}

Response (200):
{
  "_id": "user_id",
  "username": "john_doe",
  "email": "john@example.com",
  "admin": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Listings

#### Get All Listings
```http
GET /api/listing?search=villa&category=house&minPrice=1000&maxPrice=5000

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "listing_id",
      "title": "Luxury Villa",
      "description": "Beautiful villa with ocean view",
      "price": 3000,
      "category": "house",
      "location": "Miami Beach",
      "images": ["url1", "url2"],
      "geometry": {
        "coordinates": [-80.1300, 25.7907]
      },
      "owner": {
        "_id": "user_id",
        "username": "john_doe",
        "email": "john@example.com"
      },
      "reviews": [],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Listing by ID
```http
GET /api/listing/:id

Response (200):
{
  "success": true,
  "data": {
    "_id": "listing_id",
    "title": "Luxury Villa",
    "description": "Beautiful villa with ocean view",
    "price": 3000,
    "category": "house",
    "location": "Miami Beach",
    "images": ["url1", "url2"],
    "geometry": {
      "coordinates": [-80.1300, 25.7907]
    },
    "owner": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com"
    },
    "reviews": []
  }
}
```

#### Create Listing
```http
POST /api/listing
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request Body (FormData):
{
  "title": "Luxury Villa",
  "description": "Beautiful villa with ocean view",
  "price": 3000,
  "category": "house",
  "location": "Miami Beach",
  "coordinates": "[-80.1300, 25.7907]",
  "images": [File, File, File]
}

Response (201):
{
  "success": true,
  "message": "Listing created successfully",
  "data": {
    "_id": "listing_id",
    "title": "Luxury Villa",
    "price": 3000,
    "location": "Miami Beach",
    "images": ["cloudinary_url1", "cloudinary_url2"],
    "owner": "user_id"
  }
}
```

#### Update Listing
```http
PUT /api/listing/:listingId
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request Body (FormData):
{
  "title": "Updated Villa",
  "price": 3500,
  "images": [File] (optional)
}

Response (200):
{
  "success": true,
  "message": "Listing updated successfully",
  "data": {
    "_id": "listing_id",
    "title": "Updated Villa",
    "price": 3500
  }
}
```

#### Delete Listing
```http
DELETE /api/listing/:listingId
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Listing deleted successfully"
}
```

#### Get User Listings
```http
GET /api/listing/user-listing
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "listing_id",
      "title": "My Villa",
      "price": 3000,
      "location": "Miami Beach"
    }
  ]
}
```

#### Export Listings to CSV
```http
GET /api/listing/csv-data
Authorization: Bearer {token}

Response (200):
Content-Type: text/csv
Content-Disposition: attachment; filename=listings.csv
```

#### Delete Listing Image
```http
DELETE /api/listing/:id/image
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "imageUrl": "cloudinary_url"
}

Response (200):
{
  "message": "Image deleted successfully"
}
```

### Bookings

#### Create Booking
```http
POST /api/booking/:listingId
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "checkIn": "2024-06-01",
  "checkOut": "2024-06-05",
  "guests": 4
}

Response (201):
{
  "_id": "booking_id",
  "listing": "listing_id",
  "customer": "user_id",
  "checkIn": "2024-06-01T00:00:00.000Z",
  "checkOut": "2024-06-05T00:00:00.000Z",
  "guests": 4,
  "stayDay": 4,
  "totalPrice": 12000,
  "status": "pending",
  "isPaid": false
}
```

#### Get User Bookings
```http
GET /api/booking/user
Authorization: Bearer {token}

Response (200):
[
  {
    "_id": "booking_id",
    "listing": {
      "_id": "listing_id",
      "title": "Luxury Villa",
      "images": ["url1"],
      "location": "Miami Beach"
    },
    "checkIn": "2024-06-01T00:00:00.000Z",
    "checkOut": "2024-06-05T00:00:00.000Z",
    "guests": 4,
    "totalPrice": 12000,
    "status": "pending",
    "isPaid": false
  }
]
```

#### Get All Bookings (Admin)
```http
GET /api/booking/all
Authorization: Bearer {token}

Response (200):
[
  {
    "_id": "booking_id",
    "listing": {...},
    "customer": {...},
    "status": "confirmed"
  }
]
```

#### Update Booking Status (Owner)
```http
PUT /api/booking/status
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "bookingId": "booking_id",
  "status": "confirmed"
}

Response (200):
{
  "_id": "booking_id",
  "status": "confirmed",
  "listing": {...},
  "customer": {...}
}
```

#### Delete Booking
```http
DELETE /api/booking/delete
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "bookingId": "booking_id"
}

Response (200):
{
  "message": "Booking deleted successfully"
}
```

#### Update Payment Status
```http
PUT /api/booking/payment
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "bookingId": "booking_id"
}

Response (200):
{
  "success": true,
  "booking": {
    "_id": "booking_id",
    "isPaid": true
  }
}
```

#### Get Listing Owner Bookings
```http
GET /api/booking/owner
Authorization: Bearer {token}

Response (200):
[
  {
    "_id": "booking_id",
    "listing": {...},
    "customer": {...},
    "status": "pending"
  }
]
```

### Reviews

#### Create Review
```http
POST /api/review/:listingId
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "rating": 5,
  "comment": "Amazing place!"
}

Response (201):
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "_id": "review_id",
    "listing": "listing_id",
    "user": "user_id",
    "rating": 5,
    "comment": "Amazing place!"
  }
}
```

#### Get Listing Reviews
```http
GET /api/review/:listingId

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "review_id",
      "user": {
        "_id": "user_id",
        "username": "john_doe"
      },
      "rating": 5,
      "comment": "Amazing place!",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Delete Review
```http
DELETE /api/review/:reviewId
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Review deleted successfully"
}
```

### Likes/Wishlist

#### Toggle Like
```http
POST /api/like
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "listingId": "listing_id",
  "userId": "user_id"
}

Response (200):
{
  "liked": true,
  "message": "Listing liked"
}
```

#### Check Like Status
```http
GET /api/like/check?listingId=listing_id&userId=user_id
Authorization: Bearer {token}

Response (200):
{
  "liked": true
}
```

#### Get User Liked Listings
```http
GET /api/like/user/:userId
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "listing_id",
      "title": "Luxury Villa",
      "price": 3000,
      "images": ["url1"]
    }
  ]
}
```

### Payment

#### Create Checkout Session
```http
POST /api/payment/create-checkout-session
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "listing": {
    "title": "Luxury Villa",
    "images": ["url1"],
    "price": 3000
  },
  "bookingId": "booking_id",
  "stayDay": 4
}

Response (200):
{
  "url": "https://checkout.stripe.com/session_id"
}
```

#### Create Payment by Booking ID
```http
GET /api/payment/booking/:bookingId

Response (200):
{
  "url": "https://checkout.stripe.com/session_id"
}
```

## 📁 Frontend Structure

```
Frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Listing.tsx
│   │   ├── Navbar.tsx
│   │   ├── ReviewContainer.tsx
│   │   └── ListingOwnerBooking.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Profile.tsx
│   │   ├── ListingPage.tsx
│   │   ├── CreateListing.tsx
│   │   └── UpdateListing.tsx
│   ├── utils/
│   │   ├── authStore.ts
│   │   └── apiRequest.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts
```

## 📁 Backend Structure

```
Backend/
├── src/
│   ├── config/
│   │   └── cloudinary.ts
|   |   └── db.ts
│   ├── controllers/
│   │   ├── user.controller.ts
│   │   ├── listing.controller.ts
│   │   ├── booking.controller.ts
│   │   ├── review.controller.ts
│   │   ├── like.controller.ts
│   │   └── payment.controller.ts
│   ├── middlewares/
│   │   ├── verifyToken.ts
│   │   └── multer.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── listing.model.ts
│   │   ├── booking.model.ts
│   │   ├── review.model.ts
│   │   └── like.model.ts
│   ├── routes/
│   │   ├── user.routes.ts
│   │   ├── listing.routes.ts
│   │   ├── booking.routes.ts
│   │   ├── review.routes.ts
│   │   ├── like.routes.ts
│   │   └── payment.routes.ts
│   ├── services/
│   │   └── mail.service.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

## 🔒 Authentication Flow

1. User registers/logs in
2. Backend generates JWT token (24-hour expiry)
3. Token stored in HTTP-only cookie and returned to client
4. Frontend stores user data and token expiry in Zustand store
5. All protected routes require valid JWT token
6. Token automatically expires after 24 hours on both frontend and backend

## 📧 Email Notifications

The system sends automated emails for:
- **Booking Creation**: Confirmation email with booking details
- **Booking Confirmation**: Enhanced email with payment link when owner confirms

## 💳 Payment Flow

1. User creates booking (status: pending)
2. Owner confirms booking (status: confirmed)
3. User receives confirmation email with "Pay Now" button
4. Clicking button redirects to Stripe checkout
5. After successful payment, booking status updated to paid
6. User redirected back to profile page

## 🚀 Deployment

### Backend Deployment (Render/Railway)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables
6. Deploy

## 📝 License

MIT License

## 👥 Contributors

- Your Name

## 📞 Support

For support, email support@listinghouse.com
