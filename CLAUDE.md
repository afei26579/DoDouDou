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
- **`app/engine/`** - Core image conversion engine (the technical moat)
  - `pixelizer.py` - Resizes images to grid dimensions using LANCZOS interpolation
  - `color_reducer.py` - K-means clustering in CIELAB color space to reduce colors
  - `palette_matcher.py` - Maps reduced colors to actual bead palette using Euclidean distance
  - `scheme_generator.py` - Orchestrates the full pipeline to generate 3 schemes
- **`app/models/`** - SQLAlchemy database models
- **`app/schemas/`** - Pydantic request/response models
- **`app/services/`** - Business logic layer
- **`app/core/`** - Security, authentication (JWT), permissions
- **`app/db/`** - Database session management

### Frontend Structure

- **`src/pages/`** - Page components (Home, Convert, Editor, Follow, etc.)
- **`src/components/`** - Reusable UI components
- **`src/api/`** - API client wrappers (axios)
- **`src/stores/`** - Zustand state management
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

### Responsive Web Design
Single React codebase adapts to mobile/tablet/desktop using Tailwind breakpoints. Mobile-first approach with bottom tab navigation.

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

- Backend: `pytest tests/ -v` - Focus on engine algorithms and API endpoints
- Frontend: `npm run test` (when configured) - Component and integration tests
- Manual testing: Use `/docs` endpoint for interactive API testing

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
- Check DATABASE_URL and REDIS_URL in `.env`
- Verify virtual environment is activated

### Frontend API calls fail
- Check backend is running on port 8000
- Verify CORS_ORIGINS includes frontend URL
- Check API base URL in `frontend/src/config/api.ts`

### Image conversion produces poor results
- Check input image quality and size
- Verify palette data is loaded correctly
- Adjust color count parameters in scheme configs
- Review color reduction algorithm parameters

## Project Status

Currently in **Phase 1 (MVP)** - Core conversion engine and basic UI implemented. See README.md for detailed roadmap and progress tracking.
