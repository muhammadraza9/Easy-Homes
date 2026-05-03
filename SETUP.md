# 🏠 Easy Homes - Real Estate Platform

A modern Next.js real estate platform for buying, selling, and renting properties with features like property listings, user authentication, messaging, and saved properties.

## ✨ Features

- 🏘️ **Property Listings** - Browse and search properties with advanced filters
- 🔑 **User Authentication** - Google OAuth login with NextAuth
- 📝 **Property Management** - Post, edit, and delete your properties
- ❤️ **Save Properties** - Mark your favorite properties
- 💬 **Messaging System** - Direct communication between buyers and sellers
- 📍 **Location Maps** - View properties on interactive maps
- 📱 **Responsive Design** - Works on all devices
- 🖼️ **Image Upload** - Upload property images via Cloudinary
- 📊 **User Dashboard** - Manage properties, saved items, and messages

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **UI Components**: Ant Design
- **Maps**: React Leaflet
- **Image Upload**: Cloudinary
- **Styling**: Tailwind CSS

## 📋 Prerequisites

- Node.js 18+
- MySQL database
- Google OAuth credentials
- Cloudinary account

## 🚀 Installation & Setup

### 1. Clone and Install Dependencies
```bash
cd next-app
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the `next-app` directory with:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/easy_homes"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-key"

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Cloudinary Configuration (Get from Cloudinary Dashboard)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# API URLs
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### 3. Setup Database
```bash
# Create database
mysql -u root -p
CREATE DATABASE easy_homes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

### 4. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
next-app/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts        # Authentication
│   │   ├── properties/                        # Property endpoints
│   │   ├── messages/route.ts                  # Messaging endpoint
│   │   └── user/                              # User endpoints
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── PropertyCard.tsx
│   │   ├── SearchProperties.tsx
│   │   ├── ContactForm.tsx
│   │   ├── PropertyMap.tsx
│   │   ├── RequireAuth.tsx
│   │   └── MapClient.tsx
│   ├── properties/
│   │   ├── page.tsx                           # Browse properties
│   │   ├── add/page.tsx                       # Post property
│   │   └── [id]/
│   │       ├── page.tsx                       # View property
│   │       └── edit/page.tsx                  # Edit property
│   ├── dashboard/page.tsx                     # User dashboard
│   ├── auth/signin/page.tsx                   # Sign in page
│   ├── layout.tsx
│   ├── page.tsx                               # Home page
│   └── providers.tsx
├── lib/
│   ├── prisma.ts                              # Database client
│   └── utils/
│       └── cloudinary.ts                      # Image upload utilities
├── prisma/
│   └── schema.prisma                          # Database schema
└── types/
    └── property.ts                            # TypeScript types
```

## 🔑 API Routes

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `POST /api/properties` - Create property (auth required)
- `GET /api/properties/[id]` - Get property details
- `PUT /api/properties/[id]` - Update property (auth required)
- `DELETE /api/properties/[id]` - Delete property (auth required)
- `POST /api/properties/[id]/save` - Save property (auth required)
- `DELETE /api/properties/[id]/save` - Unsave property (auth required)

### Messages
- `GET /api/messages` - Get user messages (auth required)
- `POST /api/messages` - Send message (auth required)

### User
- `GET /api/user` - Get user profile (auth required)
- `PUT /api/user` - Update user profile (auth required)
- `GET /api/user/properties` - Get user's properties (auth required)
- `GET /api/user/saved` - Get user's saved properties (auth required)

## 🔐 Authentication Flow

1. User clicks "Sign In"
2. Redirected to Google OAuth
3. Google redirects back with auth code
4. NextAuth creates session
4. User data synced with database
5. Session maintained via JWT

## 📸 Image Upload

Images are uploaded to Cloudinary. Configure your Cloudinary account in environment variables.

## 🗄️ Database Schema

### User
- id, email, name, image, phone, address, bio, createdAt, updatedAt

### Property
- id, title, description, price, location, latitude, longitude, bedrooms, bathrooms, area, type, status, images, featured, userId, createdAt, updatedAt

### SavedProperty
- id, userId, propertyId, createdAt (unique combination)

### Message
- id, content, isRead, senderId, receiverId, propertyId, createdAt

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
1. Build: `npm run build`
2. Start: `npm run start`

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Check DATABASE_URL is correct
- Run `npm run prisma:migrate` again

### Authentication Not Working
- Verify NEXTAUTH_SECRET is set
- Check Google OAuth credentials
- Ensure NEXTAUTH_URL matches deployment URL

### Image Upload Issues
- Verify Cloudinary credentials
- Check file size limits
- Ensure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is set

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For support or questions, please reach out through the platform's messaging system.
