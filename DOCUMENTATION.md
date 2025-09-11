# Flex Living Assessment App - Technical Documentation

## Tech Stack

### Backend
- **Framework**: FastAPI (0.116.1) - High-performance, modern Python web framework
- **Server**: Uvicorn (0.35.0) - Lightning-fast ASGI server
- **Language**: Python 3.12+
- **Dependency Management**: Poetry - Modern Python dependency management
- **Data Storage**: JSON files for persistence (properties.json, reviews.json, location.json)
- **Image Serving**: FastAPI FileResponse for static asset delivery

### Frontend
- **Framework**: React 19.1.1 with TypeScript 5.9.2
- **Build Tool**: Vite 7.1.2 - Fast build tool and dev server
- **State Management**: Zustand 5.0.8 - Lightweight state management
- **Styling**: Tailwind CSS 3.4.17 - Utility-first CSS framework
- **Charts**: Recharts 3.2.0 - Composable charting library
- **Date Handling**: React DatePicker 8.7.0
- **Notifications**: React Hot Toast 2.6.0
- **Icons**: Lucide React 0.543.0
- **Package Manager**: PNPM 8.0.0

### Development Tools
- **Linting**: ESLint with React hooks and refresh plugins
- **Formatting**: Prettier for code formatting
- **CSS Processing**: PostCSS with Autoprefixer
- **Type Safety**: Full TypeScript implementation

## Key Design and Logic Decisions

### Architecture Decisions

#### 1. **Monorepo Structure**
- Organized as separate `frontend/` and `backend/` directories
- Independent deployment configurations (Vercel for both)
- Clear separation of concerns while maintaining project cohesion

#### 2. **File-Based Data Storage**
- **Decision**: JSON files instead of traditional database
- **Rationale**: 
  - Simplicity for assessment/demo purposes
  - No database setup complexity
  - Easy data inspection and modification
  - Sufficient for the scope of requirements
- **Trade-offs**: Limited scalability, no ACID properties, but adequate for current needs

#### 3. **State Management Strategy**
- **Choice**: Zustand over Redux/Context API
- **Benefits**: 
  - Minimal boilerplate
  - TypeScript-first approach
  - No providers needed
  - Simple async handling

### Frontend Design Decisions

#### 1. **Component Architecture**
```
components/
├── homepage/          # Landing and search functionality
├── propertypage/      # Property listings
├── propertydetails/   # Individual property views  
├── dashboardpage/     # Manager analytics dashboard
└── components/        # Shared UI components
```

#### 2. **Responsive Design Strategy**
- **Mobile-first approach** with Tailwind CSS
- **Flexible grid system** for property cards
- **Adaptive navigation** between different view modes
- **Custom color scheme** (`flex-green`, `vanilla`) for brand consistency

#### 3. **User Experience Flow**
- **Authentication Modal**: Blocks access until user identifies as guest or manager
- **Progressive Disclosure**: Different interfaces based on user role
- **Contextual Navigation**: Breadcrumb-style navigation between property views

### Backend Design Decisions

#### 1. **API Design Philosophy**
- **RESTful endpoints** with clear resource naming
- **Query parameter flexibility** for filtering and searching
- **Consistent error handling** with proper HTTP status codes
- **CORS enabled** for frontend integration

#### 2. **Data Processing Logic**
- **In-memory processing** for calculations (acceptable for current data size)
- **Defensive programming** with extensive null checks and validation
- **Date handling** with proper parsing and error catching
- **Aggregation logic** for analytics (monthly trends, averages, counts)

#### 3. **Performance Considerations**
- **File caching**: Data loaded per request (could be optimized with caching)
- **Minimal dependencies**: Only essential packages to reduce overhead
- **Efficient filtering**: Early data filtering to reduce processing

## API Behaviors

### Authentication & Health
- `GET /` - Welcome message
- `GET /health` - Health check endpoint

### Property Management
- `GET /properties` - Returns all properties with full details
- `GET /total-properties` - Count of total properties
- `GET /images/{folder_id}` - Lists images for a property
- `GET /images/{folder_id}/{filename}` - Serves individual property images
- `GET /logos/{filename}` - Serves logo assets

### Review System
- `GET /reviews` - Flexible review retrieval
  - **Query Parameters**: 
    - `propertyId` (int): Filter by single property
    - `propertyIds` (list[int]): Filter by multiple properties
  - **Response**: Filtered reviews with guest info and ratings
  
- `POST /addreviews` - Submit new review
  - **Validation**: Required fields, rating range (1-10), non-empty text
  - **Auto-generation**: Creates unique ID and default metadata
  
- `PUT /reviews/{review_id}` - Update review approval status
  - **Use Case**: Manager approval workflow

### Analytics & Insights

#### Basic Metrics
- `GET /total-reviews` - Total review count
- `GET /total-reviewed-properties` - Count of properties with reviews
- `GET /average-rating` - Overall average rating
- **Date Filtering**: Most endpoints support `start_date` and `end_date` parameters

#### Time-Series Data
- `GET /monthly-average-rating` - Monthly rating trends
- `GET /monthly-total-reviews` - Monthly review volume
- `GET /monthly-total-reviewed-properties` - Monthly property coverage
- `GET /property-monthly-rating/{property_id}` - Individual property trends

#### Advanced Analytics
- `GET /property-performance` - Property segmentation
  - **High Value**: Properties with rating > 5 (sorted by rating × review count)
  - **Need Attention**: Properties with rating ≤ 5 or no reviews
  
- `GET /review-categories` - Review category distribution with counts
- `GET /reviews-date-range` - Available date range for filtering

### Error Handling
- **404**: Resource not found (files, properties, reviews)
- **400**: Bad request (validation failures, missing fields)
- **Consistent Format**: JSON error responses with descriptive messages

### File Operations
- **Image Serving**: Direct file serving with proper MIME types
- **Path Safety**: Absolute path construction to prevent directory traversal
- **Existence Checks**: Validates file existence before serving

### Data Validation
- **Review Submission**:
  - Required fields validation
  - Rating bounds checking (1-10)
  - Non-empty string validation
  - List type validation for categories
  
- **Date Handling**:
  - Flexible date parsing with error catching
  - Consistent date format expectations (YYYY-MM-DD)
  - Graceful handling of malformed dates

### Performance Characteristics
- **File I/O**: Reads JSON files per request (suitable for current scale)
- **Memory Usage**: Loads full datasets for filtering/processing
- **Response Time**: Fast for current data size (~100 properties, ~1000 reviews)
- **Scalability**: Would require database migration for production scale