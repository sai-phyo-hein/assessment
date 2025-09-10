# Flex Living Assessment App

A comprehensive web application for managing and assessing rental properties, featuring property listings, guest reviews, performance analytics, and a user-friendly dashboard for property managers.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Frontend Components](#frontend-components)
- [Data Models](#data-models)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Flex Living Assessment App is designed to help property managers and hosts track and analyze their rental property performance through guest reviews and ratings. The application provides both a public-facing property browsing interface and a manager dashboard with detailed analytics and insights.

## Features

### For Property Managers
- **Dashboard Analytics**: Comprehensive performance metrics including average ratings, review counts, and property comparisons
- **Review Management**: View, approve, and manage guest reviews
- **Date Range Filtering**: Analyze performance over specific time periods
- **Property Performance Tracking**: Identify high-value properties and those needing attention
- **Monthly Trends**: Track rating trends and review volumes over time

### For Guests/Users
- **Property Search**: Browse available properties with detailed information
- **Property Details**: View comprehensive property information including images, amenities, and reviews
- **Location-Based Search**: Find properties by location
- **Review System**: Read authentic guest reviews and ratings

## Architecture

The application follows a modern full-stack architecture:

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────┐
│   Frontend      │◄────────────────►│   Backend       │
│   (React + TS)  │                 │   (FastAPI)     │
└─────────────────┘                 └─────────────────┘
                                           │
                                           ▼
                                   ┌─────────────────┐
                                   │   Data Layer    │
                                   │   (JSON Files)  │
                                   └─────────────────┘
```

### Backend Architecture
- **FastAPI**: High-performance web framework for building APIs
- **CORS Support**: Configured for frontend-backend communication
- **File-Based Storage**: JSON files for data persistence
- **Image Serving**: Static file serving for property images and logos

### Frontend Architecture
- **React with TypeScript**: Type-safe component development
- **Zustand**: Lightweight state management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component-Based**: Modular and reusable UI components

## Technology Stack

### Backend
- **Python 3.12+**
- **FastAPI**: Modern web framework
- **Uvicorn**: ASGI server
- **Poetry**: Dependency management

### Frontend
- **React 19**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: State management
- **Recharts**: Data visualization
- **React Hot Toast**: Notifications
- **React DatePicker**: Date selection
- **Lucide React**: Icon library

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## Project Structure

```
flex-living-assessment-app/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── pyproject.toml          # Poetry configuration
│   ├── poetry.lock             # Dependency lock file
│   └── data/
│       ├── properties.json     # Property data
│       ├── reviews.json        # Review data
│       ├── location.json       # Location data
│       └── images/
│           ├── images/         # Property images
│           └── logos/          # Logo files
├── frontend/
│   ├── src/
│   │   ├── App.tsx             # Main application component
│   │   ├── global-store.ts     # Zustand store
│   │   ├── index.css           # Global styles
│   │   ├── main.tsx            # Application entry point
│   │   ├── components/         # Shared components
│   │   │   ├── dropdown.tsx
│   │   │   ├── popup.tsx
│   │   ├── homepage/           # Home page components
│   │   │   ├── navbar.tsx
│   │   │   ├── search.tsx
│   │   │   ├── location-gallery.tsx
│   │   │   ├── location-card.tsx
│   │   │   └── homepage-search-bar.tsx
│   │   ├── propertypage/       # Property listing page
│   │   │   ├── propertypage.tsx
│   │   │   ├── property-card.tsx
│   │   │   └── property-search-bar.tsx
│   │   ├── propertydetails/    # Property detail page
│   │   │   ├── propertydetailpage.tsx
│   │   │   ├── gallery.tsx
│   │   │   ├── review-slideshow.tsx
│   │   │   └── star.tsx
│   │   └── dashboardpage/      # Manager dashboard
│   │       ├── dashboard.tsx
│   │       ├── dashboard-nav-bar.tsx
│   │       ├── dashboard-search-bar.tsx
│   │       ├── detail-section.tsx
│   │       ├── item-card.tsx
│   │       ├── review-details.tsx
│   │       └── summary-section.tsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── tsconfig.json
└── README.md
```

## Setup and Installation

### Prerequisites

- **Python 3.12+** (for backend)
- **Node.js 18+** (for frontend)
- **Poetry** (Python dependency management)
- **pnpm** (Node.js package manager)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   poetry install
   ```

3. **Run the development server:**
   ```bash
   poetry run uvicorn main:app --reload
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Run the development server:**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:5173`

### Running Both Services

For development, you'll need to run both backend and frontend servers simultaneously:

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   poetry run uvicorn main:app --reload
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   pnpm dev
   ```

## API Documentation

The backend provides RESTful APIs for property management and analytics.

### Base URL
```
http://localhost:8000
```

### Endpoints

#### Health Check
- **GET** `/health`
  - Returns server health status

#### Properties
- **GET** `/properties`
  - Returns all properties
- **GET** `/total-properties`
  - Returns total count of properties

#### Reviews
- **GET** `/reviews`
  - Query parameters: `propertyId`, `propertyIds`
  - Returns filtered reviews
- **POST** `/addreviews`
  - Body: Review object
  - Adds a new review
- **PUT** `/reviews/{review_id}`
  - Body: `{"approved": boolean}`
  - Updates review approval status
- **GET** `/total-reviews`
  - Returns total review count
- **GET** `/total-reviewed-properties`
  - Query parameters: `start_date`, `end_date`
  - Returns count of reviewed properties in date range

#### Analytics
- **GET** `/average-rating`
  - Query parameters: `start_date`, `end_date`
  - Returns average rating
- **GET** `/review-categories`
  - Returns review category counts
- **GET** `/monthly-average-rating`
  - Returns monthly average ratings
- **GET** `/monthly-total-reviews`
  - Returns monthly review counts
- **GET** `/property-performance`
  - Returns high-value and need-attention properties
- **GET** `/property-monthly-rating/{property_id}`
  - Returns monthly ratings for specific property

#### Images
- **GET** `/images/{folder_id}`
  - Returns list of images for property
- **GET** `/images/{folder_id}/{filename}`
  - Returns specific image file
- **GET** `/logos/{filename}`
  - Returns logo file

#### Date Range
- **GET** `/reviews-date-range`
  - Returns min and max review dates

### Response Formats

#### Property Object
```json
{
  "id": 0,
  "name": "Spacious 1 Bed Flat in Angel",
  "per_night_price": 185,
  "location": "London",
  "bedrooms": 1,
  "bathrooms": 1,
  "max_guests": 4,
  "beds": 7
}
```

#### Review Object
```json
{
  "id": 1,
  "propertyId": 38,
  "rating": 9,
  "publicReview": "Wonderful stay! The location was perfect.",
  "reviewCategory": ["location", "cleanliness"],
  "departureDate": "2024-05-15 11:00:00",
  "guestName": "Olivia Martinez"
}
```

## Frontend Components

### Core Components
- **App**: Main application component with routing logic
- **Modal**: Authentication modal
- **Navbar**: Navigation bar for user interface

### Homepage Components
- **Search**: Main search interface
- **LocationGallery**: Grid of location cards
- **LocationCard**: Individual location display
- **HomepageSearchBar**: Search functionality

### Property Components
- **PropertyPage**: Property listing page
- **PropertyCard**: Individual property card
- **PropertySearchBar**: Property search and filtering

### Property Details Components
- **PropertyDetailPage**: Detailed property view
- **Gallery**: Image gallery component
- **ReviewSlideshow**: Review display component
- **Star**: Rating star component

### Dashboard Components
- **Dashboard**: Main dashboard page
- **DashboardNavBar**: Dashboard navigation
- **DashboardSearchBar**: Date range filtering
- **DetailSection**: Detailed analytics section
- **ItemCard**: Property performance card
- **ReviewDetails**: Review management section
- **SummarySection**: Summary metrics display

## Data Models

### Property
```typescript
interface Property {
  id: number;
  name: string;
  per_night_price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  beds: number;
}
```

### Review
```typescript
interface Review {
  id: number;
  accountId: number;
  listingMapId: number;
  propertyId: number;
  channelId: number;
  type: string;
  status: string;
  rating: number;
  externalReviewId: string;
  externalReservationId: string;
  publicReview: string;
  privateFeedback?: string;
  revieweeResponse?: string;
  isRevieweeRecommended?: boolean;
  isCancelled: number;
  reviewCategory: string[];
  departureDate: string;
  arrivalDate: string;
  listingName: string;
  guestName: string;
  approved?: boolean;
}
```

### Image
```typescript
interface Image {
  src: string;
  alt?: string;
  type?: string;
}
```

## Usage

### For Property Managers

1. **Access Dashboard**: Set `isManager` to `true` in the global store
2. **View Analytics**: Navigate through summary and detail views
3. **Filter by Date**: Use date range picker to analyze specific periods
4. **Manage Reviews**: Approve or reject pending reviews
5. **Monitor Performance**: Track property ratings and trends

### For Guests

1. **Browse Properties**: Use the homepage to search locations
2. **View Details**: Click on properties to see full details and reviews
3. **Read Reviews**: Check authentic guest feedback and ratings

## Deployment

### Vercel Deployment (Frontend)

The frontend can be deployed to Vercel for easy hosting and automatic deployments.

#### Prerequisites
- Vercel account
- GitHub repository connected to Vercel

#### Deployment Steps

1. **Connect Repository:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings:**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

3. **Environment Variables:**
   Add the following environment variables in Vercel dashboard:
   ```
   VITE_API_BASE_URL=https://your-backend-url.com
   ```

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your frontend

#### Vercel Configuration File

Create `frontend/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Backend Deployment Options

Since Vercel doesn't natively support Python backends, consider these alternatives:

#### Option 1: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Option 2: Render
- Connect GitHub repository
- Select "Web Service"
- Runtime: Python 3
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

#### Option 3: Heroku
```bash
# Create requirements.txt from pyproject.toml
poetry export -f requirements.txt --output requirements.txt

# Create Procfile
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Deploy
heroku create your-app-name
git push heroku main
```

### Production Configuration

#### Environment Variables
Update your frontend environment variables for production:

```bash
# .env.production
VITE_API_BASE_URL=https://your-production-backend-url.com
VITE_APP_ENV=production
```

#### CORS Configuration
Update backend CORS settings for production:

```python
# In backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to chosen platform
- [ ] Environment variables configured
- [ ] CORS settings updated for production
- [ ] API endpoints tested in production
- [ ] Images and static files accessible
- [ ] Database connections (if any) configured

### Monitoring and Maintenance

- **Vercel Analytics**: Monitor frontend performance
- **Error Tracking**: Set up error monitoring (e.g., Sentry)
- **CI/CD**: Configure automatic deployments on push
- **Domain**: Connect custom domain if needed

---

**Author**: Sai Phyo Hein  
**Email**: phyohein.1196@gmail.com  
**Version**: 1.0.0  
**Last Updated**: September 11, 2025
