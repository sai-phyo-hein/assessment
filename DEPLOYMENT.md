# Local Development Guide

## Prerequisites Installation

### 1. **Install Node.js**

#### Option A: Using Node Version Manager (Recommended)
```bash
# Install nvm (Linux/macOS)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or source the profile
source ~/.bashrc

# Install and use Node.js LTS
nvm install --lts
nvm use --lts
```

#### Option B: Direct Installation
- Download from [nodejs.org](https://nodejs.org/) (LTS version recommended)
- Follow installation instructions for your operating system

#### Verify Installation
```bash
node --version  # Should show v18+ or v20+
npm --version   # Should show 9+ or 10+
```

### 2. **Install pnpm**
```bash
# Install pnpm globally
npm install -g pnpm

# Verify installation
pnpm --version  # Should show 8.0.0+
```

### 3. **Install Python & Poetry**

#### Python Installation
```bash
# Check if Python 3.12+ is installed
python3 --version

# If not installed:
# Ubuntu/Debian:
sudo apt update && sudo apt install python3.12 python3.12-pip

# macOS (with Homebrew):
brew install python@3.12

# Windows: Download from python.org
```

#### Poetry Installation
```bash
# Install Poetry
curl -sSL https://install.python-poetry.org | python3 -

# Add to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH="$HOME/.local/bin:$PATH"

# Verify installation
poetry --version
```

## Local Development Setup

### 1. **Clone the Repository**
```bash
git clone https://github.com/sai-phyo-hein/assessment.git
cd assessment
# or your specific repository name:
# cd flex-living-assessment-app
```

### 2. **Backend Setup**
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies using Poetry
poetry install

# Alternative: Install with pip if Poetry isn't available
pip install -r requirements.txt

# Verify FastAPI installation
poetry run python -c "import fastapi; print('FastAPI installed successfully')"
```

### 3. **Frontend Setup**
```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies with pnpm
pnpm install

# Alternative: Use npm if pnpm isn't available
# npm install

# Verify installation
pnpm list react  # Should show React 19.1.1
```

### 4. **Environment Configuration**
```bash
# In frontend directory, create .env.local file
echo "VITE_API_BASE_URL=http://localhost:8000" > .env.local

# Verify environment file
cat .env.local
```

## Running the Application Locally

### 1. **Start the Backend Server**
```bash
# From backend directory
cd backend

# Using Poetry (recommended)
poetry run uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Alternative: Using Python directly
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Backend will be available at: http://localhost:8000
```

### 2. **Start the Frontend Development Server**
```bash
# Open a new terminal, navigate to frontend directory
cd frontend

# Start the development server
pnpm dev

# Alternative: Using npm
# npm run dev

# Frontend will be available at: http://localhost:5173
```

### 3. **Verify Everything is Working**
- **Backend Health Check**: Open http://localhost:8000/health
- **Frontend Application**: Open http://localhost:5173
- **API Documentation**: Open http://localhost:8000/docs (FastAPI auto-generated docs)

## Project Structure

```
flex-living-assessment-app/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── pyproject.toml       # Poetry dependencies
│   ├── requirements.txt     # Pip dependencies
│   └── data/               # JSON data files
│       ├── properties.json
│       ├── reviews.json
│       ├── location.json
│       └── images/         # Property images
├── frontend/
│   ├── package.json        # pnpm dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS config
│   ├── .env.local         # Local environment variables
│   └── src/               # React components
└── DEPLOYMENT.md          # This guide
```

## Local API Endpoints

When running locally, all backend endpoints are accessible via:
```
http://localhost:8000/[endpoint]
```

Examples:
- `http://localhost:8000/health`
- `http://localhost:8000/properties`
- `http://localhost:8000/reviews`
- `http://localhost:8000/images/{folder_id}`

## Development Workflow

1. **Make Changes**: Edit files in `backend/` or `frontend/`
2. **Auto-Reload**: Both servers support hot reloading
3. **Testing**: Changes appear immediately in the browser
4. **API Testing**: Use FastAPI docs at http://localhost:8000/docs

## Common Issues & Solutions

### Issue: "node: command not found"
```bash
# Solution: Install Node.js or check PATH
echo $PATH  # Verify node is in PATH
which node  # Should show node location
```

### Issue: "pnpm: command not found"
```bash
# Solution: Install pnpm globally
npm install -g pnpm
# Or check if it's in PATH
which pnpm
```

### Issue: "poetry: command not found"
```bash
# Solution: Install Poetry or add to PATH
export PATH="$HOME/.local/bin:$PATH"
# Add to ~/.bashrc or ~/.zshrc for persistence
```

### Issue: Backend fails to start
```bash
# Check Python version
python3 --version  # Should be 3.12+

# Install dependencies
cd backend
poetry install  # or pip install -r requirements.txt

# Check if FastAPI is installed
poetry run python -c "import fastapi"
```

### Issue: Frontend fails to start
```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check if all dependencies are installed
pnpm list
```

### Issue: CORS Errors
- **Cause**: Frontend and backend running on different ports
- **Solution**: Already configured in `main.py` with `allow_origins=["*"]`
- **Local URLs**: Frontend (http://localhost:5173) → Backend (http://localhost:8000)

### Issue: API Calls Failing
```bash
# Verify backend is running
curl http://localhost:8000/health

# Check environment variables
cat frontend/.env.local  # Should have VITE_API_BASE_URL=http://localhost:8000
```

### Issue: Images Not Loading
- **Check**: Images are in `backend/data/images/images/` directory
- **Verify**: Backend can serve static files at `/images/{folder_id}/{filename}`

## Additional Commands

### Backend Commands
```bash
# Run with specific host/port
poetry run uvicorn main:app --host localhost --port 8001

# Production mode (no auto-reload)
poetry run uvicorn main:app --host 0.0.0.0 --port 8000

# Check installed packages
poetry show  # or pip list
```

### Frontend Commands
```bash
# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linting
pnpm lint

# Format code
pnpm format
```

### Development Tools
```bash
# Watch backend logs
tail -f backend/app.log  # if logging to file

# Monitor frontend build
pnpm build --watch

# Type checking
cd frontend && npx tsc --noEmit
```
