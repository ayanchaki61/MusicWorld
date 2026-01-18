# MusicWorld - AI Coding Agent Instructions

## Project Overview
MusicWorld is a full-stack music streaming application with:
- **Frontend**: React + Vite with music player and genre filtering
- **Backend**: Node.js + Express REST API
- **Database**: MongoDB for music metadata storage
- **Auth**: JWT-based authentication for admin access
- **Storage**: Local files in dev (`/public/music/`), server/CDN URLs in production

## Architecture & Key Patterns

### Backend Structure (Node.js + Express)
```
server/
├── models/
│   └── Music.js          # Mongoose schema for music metadata
├── routes/
│   ├── music.js          # Public music endpoints (GET /api/music)
│   └── admin.js          # Protected admin endpoints (POST, PUT, DELETE)
├── middleware/
│   ├── auth.js           # JWT verification middleware
│   └── upload.js         # Multer config for file uploads (dev only)
├── controllers/
│   ├── musicController.js
│   └── adminController.js
└── server.js             # Express app entry point
```

### Music File Handling
- **Development**: Music files in `server/uploads/music/`, served via Express static middleware
- **Production**: Files uploaded to CDN/cloud storage, URLs stored in MongoDB
- Use environment variables (`VITE_MUSIC_SOURCE`) to switch between local and remote storage
- Backend stores only metadata and file references in MongoDB
- Frontend fetches music list via `GET /api/music`, filtered by genre via query params

### Component Structure
```
src/
├── components/
│   ├── Player/          # Music player controls, progress bar, volume
│   ├── MusicList/       # Display music tracks with filtering
│   ├── GenreFilter/     # Genre selection/filtering UI
│   └── Admin/           # Admin-only components for adding music
├── pages/
│   ├── Home.jsx         # Main music browsing and playback
│   └── Admin.jsx        # Music management interface
├── hooks/
│   ├── useAudioPlayer.js  # Audio playback state management
│   └── useMusicLibrary.js # Fetch and manage music data
└── services/
    ├── musicService.js  # API calls for music CRUD operations
    └── storageService.js # Handle dev vs prod file paths
```

### State Management
- Use React Context or Redux for global player state (currently playing, queue, volume)
- Local state for component-specific UI (filter selections, admin forms)
- Audio element should be managed via ref and custom hook (`useAudioPlayer`)

### Genre Management
- Genres should be configurable (not hardcoded) - store in `src/config/genres.js`
- Support genre filtering, multiple genres per track
- Common genres: Rock, Pop, Jazz, Classical, Electronic, Hip-Hop, Country, R&B

### Admin Features
- **Authentication**: JWT tokens stored in localStorage/httpOnly cookies
- **Backend protection**: `auth.js` middleware verifies JWT on `/api/admin/*` routes
- **Frontend protection**: React Router guards check token validity before rendering admin pages
- Admin endpoints:
  - `POST /api/admin/music` - Upload music + metadata (multipart/form-data in dev)
  - `PUT /api/admin/music/:id` - Update music metadata
  - `DELETE /api/admin/music/:id` - Remove music from library
- Validate audio file formats (MP3, WAV, OGG) with Multer before saving
- Admin login: `POST /api/auth/login` returns JWT token

## Development Workflows

### Local Development
```bash
# Frontend (Vite)
cd client
npm run dev                 # Start Vite dev server (default: http://localhost:5173)
npm run build               # Production build
npm run preview             # Preview production build

# Backend (Node.js)
cd server
npm run dev                 # Start Express with nodemon (default: http://localhost:5000)
npm start                   # Start Express in production
npm test                    # Run API tests

# Full-stack (from root)
npm run dev                 # Concurrently run both frontend and backend
```

### Adding New Music (Development)
1. Place audio file in `/public/music/`
2. Add metadata entry to music database/JSON file
3. Ensure cover art is available in `/public/covers/`

### Environment Configuration
**Frontend (`client/.env`)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_MUSIC_SOURCE=local         # or 'cdn'
VITE_CDN_URL=https://cdn.example.com
```

**Backend (`server/.env`)**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/musicworld
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development            # or 'production'
UPLOAD_PATH=./uploads/music
```

## Code Conventions

### Music Data Model (MongoDB Schema)
```javascript
// server/models/Music.js
const musicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: String,
  genres: [{ type: String, required: true }],
  duration: { type: Number, required: true },  // seconds
  filePath: { type: String, required: true },  // relative path or full URL
  coverArt: String,
  releaseDate: Date,
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});
```

**API Response Format**
```javascript
{
  _id: "507f1f77bcf86cd799439011",
  title: "Song Title",
  artist: "Artist Name",
  genres: ["Rock", "Alternative"],
  duration: 245,
  filePath: "/uploads/music/song.mp3",  // or https://cdn.../song.mp3
  coverArt: "/uploads/covers/cover.jpg",
  createdAt: "2026-01-18T10:30:00.000Z"
}
```

### Audio Player Integration
- Use native HTML5 `<audio>` element controlled via React ref
- Implement play/pause, seek, volume control, next/previous
- Handle audio events: `onEnded`, `onTimeUpdate`, `onLoadedMetadata`
- Persist volume and last played position to localStorage

### Styling
- Use CSS Modules or styled-components for component styling
- Ensure mobile-responsive design for music player controls
- Follow dark theme aesthetic common in music apps

## Key Files to Reference
**Frontend**
- `client/src/hooks/useAudioPlayer.js` - Core audio playback logic
- `client/src/services/musicService.js` - API calls to backend
- `client/src/config/genres.js` - Centralized genre definitions
- `client/src/pages/Home.jsx` - Main user interface pattern
- `client/vite.config.js` - Vite configuration with proxy to backend

**Backend**
- `server/models/Music.js` - Mongoose music schema
- `server/middleware/auth.js` - JWT verification logic
- `server/routes/music.js` - Public music API routes
- `server/routes/admin.js` - Protected admin routes
- `server/server.js` - Express app configuration

## Testing Priorities
**Frontend**
- Audio playback functionality (play, pause, seek, volume)
- Genre filtering and API integration
- Admin form validation and file uploads
- JWT token handling and auth flows
- Responsive design on mobile devices

**Backend**
- Music CRUD API endpoints (`/api/music`, `/api/admin/music`)
- JWT authentication middleware
- File upload validation with Multer
- MongoDB query performance (genre filtering, pagination)
- Error handling for invalid tokens/missing music

## Common Pitfalls
- **Don't hardcode API URLs** - use `import.meta.env.VITE_API_URL` in frontend
- **Protect admin routes on both frontend AND backend** - frontend guards are bypassable
- **Store JWT securely** - prefer httpOnly cookies over localStorage for production
- **Handle audio loading states** - API calls and file loading are separate concerns
- **Validate file types** on both client and server before upload
- **Use Mongoose virtuals** for computed fields (e.g., full URL construction)
- **Test cross-browser audio** format support (especially Safari with MP3)
- **Index MongoDB** genres field for faster filtering queries
- **Handle CORS** properly in Express for frontend-backend communication
