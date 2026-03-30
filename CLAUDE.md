# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

拼豆豆助手 (Bead Helper) - A full-stack web application that converts images into bead art patterns. Users upload images and the system generates three difficulty levels (simple/standard/fine) with follow-along modes, editors, and material lists.

**Tech Stack:**
- Backend: FastAPI (Python 3.11+) + PostgreSQL + Redis
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS
- Image Processing: Pillow + NumPy + scikit-learn

## Development Commands

### Backend (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Database migrations
alembic revision --autogenerate -m "description"
alembic upgrade head

# Run tests
pytest tests/ -v

# Code formatting and linting
black app/
ruff check app/
```

### Frontend (React + Vite)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Lint
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Backend Structure

The backend follows a layered architecture:

- **`app/api/v1/`** - API route handlers (RESTful endpoints)
  - `auth.py` - User authentication (register, login, refresh token)
  - `convert.py` - Image upload and conversion endpoints
- **`app/engine/`** - Core image conversion engine (the technical moat)
  - `pixelizer.py` - Resizes images to grid dimensions using LANCZOS interpolation
  - `color_reducer.py` - K-means clustering to reduce colors
  - `palette_matcher.py` - Maps reduced colors to actual bead palette using Euclidean distance
  - `scheme_generator.py` - Orchestrates the full pipeline to generate 3 schemes
- **`app/models/`** - SQLAlchemy database models (User, Work, Template, ColorPalette)
- **`app/schemas/`** - Pydantic request/response models
  - `auth.py` - Authentication schemas
  - `convert.py` - Conversion schemas (ImageUploadResponse, ConvertResponse, SchemeResponse)
- **`app/services/`** - Business logic layer
  - `user_service.py` - User management
  - `convert_service.py` - Image upload, caching, and conversion orchestration
- **`app/core/`** - Core utilities
  - `security.py` - JWT token generation and verification
  - `deps.py` - FastAPI dependencies (authentication, optional authentication)
  - `cache.py` - Redis cache client (supports binary data for images)
- **`app/data/`** - Static data
  - `artkal_palette.py` - Artkal bead color palette (30 colors)
- **`app/db/`** - Database session management

### Frontend Structure

- **`src/pages/`** - Page components
  - `Home.tsx` - Homepage with welcome, quick actions, and recommended templates
  - `Templates.tsx` - Template library (placeholder)
  - `Works.tsx` - User's bead art projects (placeholder)
  - `Profile.tsx` - User profile and settings
- **`src/components/`** - Reusable UI components
  - `BottomNav.tsx` - Bottom tab navigation (4 tabs: Home, Templates, Works, Profile)
  - `Layout.tsx` - Page layout wrapper
- **`src/api/`** - API client wrappers (axios)
  - `client.ts` - Base axios client with interceptors
  - `auth.ts` - Authentication API calls
- **`src/stores/`** - Zustand state management
  - `authStore.ts` - Authentication state
- **`src/types/`** - TypeScript type definitions
- **`src/canvas/`** - Canvas rendering engine (planned for editor/follow modes)

### Image Conversion Pipeline

The core conversion engine (`app/engine/`) processes images through these stages:

1. **Pixelization** - Resize to target grid size (15×15 simple, 29×29 standard, 58×58 fine)
2. **Color Reduction** - K-means clustering to reduce to target color count (8/15/25 colors)
3. **Palette Matching** - Map reduced colors to actual bead colors using color distance
4. **Grid Generation** - Output 2D array of color IDs representing the bead pattern

This is the technical differentiator - the quality of color matching and reduction directly impacts user satisfaction.

## Key Design Decisions

### API-First Architecture
Backend provides RESTful API at `/api/v1/*` that is platform-agnostic. The same API will serve web, WeChat mini-program, and future mobile apps. Platform identification via `X-Platform` header.

### Guest Access Support
The conversion API supports optional authentication via `get_current_user_optional()` dependency:
- Guest users can upload images and generate conversion schemes
- Authenticated users can save works and access premium features
- Smooth conversion funnel from guest to registered user

### Image Caching Strategy
Uploaded images are cached in Redis for 1 hour:
- Image bytes stored as binary data under `image:{uuid}` key
- Metadata (width, height, shape, size) stored under `image_meta:{uuid}` key
- Prevents re-upload during scheme generation
- Automatic expiration after 1 hour

### Responsive Web Design
Single React codebase adapts to mobile/tablet/desktop using Tailwind breakpoints. Mobile-first approach with bottom tab navigation (4 tabs: Home, Templates, Works, Profile).

### Simplified Engine (Current Phase)
The current implementation uses basic algorithms (K-means, Euclidean distance). Future enhancements planned:
- CIELAB color space calculations
- CIEDE2000 color difference formula
- Noise removal and edge optimization
- Large image board splitting

### Database Schema
- **users** - User accounts with preferences and usage limits
- **works** - User's bead art projects with grid_data (JSONB 2D array)
- **templates** - Pre-made patterns for quick start
- **color_palettes** - Bead color databases (Artkal, Perler, etc.)

Grid data stored as JSONB in format:
```json
{
  "format": "2d_array",
  "data": [
    ["C01", "C01", "C05", ...],
    ["C01", "C19", "C05", ...],
    ...
  ]
}
```

## Development Workflow

### Adding New API Endpoints

1. Define Pydantic schemas in `app/schemas/`
2. Create route handler in `app/api/v1/`
3. Implement business logic in `app/services/`
4. Add database models if needed in `app/models/`
5. Create migration: `alembic revision --autogenerate -m "description"`

### Adding Frontend Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Create API wrapper in `src/api/` if calling new endpoints
4. Define TypeScript types in `src/types/`
5. Use Zustand stores for state management if needed

### Working with the Conversion Engine

The engine modules are independent and testable:
- Test individual modules with sample images in `backend/tests/test_engine/`
- Pixelizer and ColorReducer use NumPy arrays (H×W×3, RGB, 0-255)
- PaletteMatcher expects palette as list of dicts with `{"id": "C01", "rgb": [255,255,255], ...}`
- SchemeGenerator orchestrates the full pipeline

## Testing

### Backend Testing

```bash
# Run all tests
pytest tests/ -v

# Test conversion engine directly (no database required)
python backend/test_engine_simple.py

# Test conversion API (requires Redis and backend running)
python backend/test_convert_api.py
```

- Backend: `pytest tests/ -v` - Focus on engine algorithms and API endpoints
- Engine testing: `test_engine_simple.py` - Standalone engine test with sample image
- API testing: `test_convert_api.py` - End-to-end API test (upload + generate)
- Frontend: `npm run test` (when configured) - Component and integration tests
- Manual testing: Use `/docs` endpoint for interactive API testing (available when DEBUG=true)

## Environment Variables

Backend requires `.env` file (see `backend/.env.example`):
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `SECRET_KEY` - JWT signing key
- `CORS_ORIGINS` - Allowed frontend origins
- `DEBUG` - Enable debug mode and API docs

## Common Issues

### Backend won't start
- Ensure PostgreSQL and Redis are running
  - Use Docker: `docker-compose up -d`
  - Or use batch scripts: `setup.bat` then `start.bat`
- Check DATABASE_URL and REDIS_URL in `.env`
- Verify virtual environment is activated
- Install missing dependencies: `pip install -r requirements.txt`

### Frontend API calls fail
- Check backend is running on port 8000
- Verify CORS_ORIGINS includes frontend URL (default: http://localhost:5173)
- Check API base URL in `frontend/src/api/client.ts`

### Image conversion produces poor results
- Check input image quality and size
- Verify palette data is loaded correctly (`app/data/artkal_palette.py`)
- Adjust color count parameters in scheme configs
- Review color reduction algorithm parameters

### Redis connection errors
- Ensure Redis is running: `docker ps` or check Windows services
- Verify REDIS_URL in `.env` (default: redis://localhost:6379)
- Check Redis cache client initialization in `app/main.py`

## Project Status

Currently in **Phase 2** - Image upload and conversion features implemented. See TODO.md for detailed roadmap and progress tracking.

### Recent Completions (Phase 2)

**Backend:**
- ✅ Image upload API (`POST /api/v1/convert/upload`)
- ✅ Scheme generation API (`POST /api/v1/convert/generate`)
- ✅ Conversion service layer with Redis caching
- ✅ Artkal color palette data (30 colors)
- ✅ Optional authentication for guest access
- ✅ Binary data support in Redis cache

**Frontend:**
- ✅ Homepage redesign (welcome, quick actions, recommendations)
- ✅ Bottom tab navigation (4 tabs)
- ✅ Templates page placeholder
- ✅ Works page with empty state
- ✅ Profile page with settings menu

**Testing:**
- ✅ Engine test script (`test_engine_simple.py`)
- ✅ API test script (`test_convert_api.py`)
- ✅ Conversion engine validated (3 schemes generated correctly)

### Next Steps

1. **Image upload frontend page** - File picker, drag-drop, upload progress
2. **Scheme selection page** - Display 3 schemes, comparison, save work
3. **Work save API** - Save selected scheme to database
4. **Works list page** - Display user's saved works

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get access token
- `POST /api/v1/auth/refresh` - Refresh access token

### Conversion (Guest-accessible)
- `POST /api/v1/convert/upload` - Upload image (returns image_id)
  - Accepts: JPEG, PNG, WEBP (max 10MB)
  - Returns: `{image_id, width, height, size}`
- `POST /api/v1/convert/generate?image_id={uuid}` - Generate 3 schemes
  - Returns: `{schemes: [...], suitability: {...}}`

### Health Check
- `GET /health` - Health check endpoint
- `GET /api/v1/ping` - API v1 ping endpoint

## Project Details
See README.md 