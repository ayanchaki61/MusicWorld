# MusicWorld - API & Web Pages Documentation

## 🌐 Frontend Pages (React Routes)

### Public Pages

#### 1. Home Page
- **URL**: `http://localhost:5173/`
- **Route**: `/`
- **Description**: Main music browsing page with player
- **Features**:
  - Music library with genre filtering
  - Search functionality
  - Music player controls
  - Pagination

#### 2. Login Page
- **URL**: `http://localhost:5173/login`
- **Route**: `/login`
- **Description**: Admin authentication page
- **Credentials**:
  - Email: `admin@musicworld.com`
  - Password: `Amiayan@61`

### Protected Pages (Admin Only)

#### 3. Admin Dashboard
- **URL**: `http://localhost:5173/admin`
- **Route**: `/admin`
- **Description**: Music management interface
- **Access**: Requires JWT token with admin role
- **Features**:
  - Add new music
  - View music library
  - Delete music tracks

---

## 🔌 Backend API Endpoints

**Base URL**: `http://localhost:5000/api`

### 📖 Public Endpoints

#### 1. Get All Music
```
GET /api/music
```
**Description**: Retrieve music list with optional filtering

**Query Parameters**:
- `genre` (optional) - Filter by genre (e.g., "Rock", "Pop", "all")
- `search` (optional) - Search by title or artist
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20) - Items per page

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Song Title",
      "artist": "Artist Name",
      "album": "Album Name",
      "genres": ["Rock", "Alternative"],
      "duration": 245,
      "filePath": "/uploads/music/music-123.mp3",
      "coverArt": "/uploads/covers/cover-456.jpg",
      "releaseDate": "2024-01-15T00:00:00.000Z",
      "createdAt": "2026-01-18T10:30:00.000Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "total": 100
}
```

#### 2. Get Single Music Track
```
GET /api/music/:id
```
**Description**: Get details of a specific music track

**URL Parameters**:
- `id` - Music track ID

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Song Title",
    "artist": "Artist Name",
    "genres": ["Rock"],
    "duration": 245,
    "filePath": "/uploads/music/music-123.mp3",
    "coverArt": "/uploads/covers/cover-456.jpg"
  }
}
```

#### 3. Get All Genres
```
GET /api/music/genres
```
**Description**: Get list of all unique genres in the library

**Response**:
```json
{
  "success": true,
  "data": ["Rock", "Pop", "Jazz", "Classical", "Electronic"]
}
```

---

### 🔐 Authentication Endpoints

#### 4. Register User
```
POST /api/auth/register
```
**Description**: Create a new user account

**Request Body**:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 5. Login User
```
POST /api/auth/login
```
**Description**: Authenticate user and get JWT token

**Request Body**:
```json
{
  "email": "admin@musicworld.com",
  "password": "Amiayan@61"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "admin",
    "email": "admin@musicworld.com",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 6. Get Current User
```
GET /api/auth/me
```
**Description**: Get current logged-in user details

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "admin",
    "email": "admin@musicworld.com",
    "role": "admin"
  }
}
```

---

### 🔒 Admin Endpoints (Protected)

**Authentication Required**: All admin endpoints require:
- Valid JWT token in Authorization header
- User role must be "admin"

**Headers**:
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

#### 7. Add New Music
```
POST /api/admin/music
```
**Description**: Upload new music track with metadata

**Content-Type**: `multipart/form-data`

**Form Data**:
- `title` (required) - Music title
- `artist` (required) - Artist name
- `album` (optional) - Album name
- `genres` (required) - Array of genres
- `duration` (required) - Duration in seconds
- `releaseDate` (optional) - Release date
- `musicFile` (required if not URL) - Audio file
- `coverFile` (optional) - Cover art image
- `filePath` (optional) - URL if using URL instead of file

**Example using FormData**:
```javascript
const formData = new FormData();
formData.append('title', 'Song Title');
formData.append('artist', 'Artist Name');
formData.append('album', 'Album Name');
formData.append('genres', 'Rock');
formData.append('genres', 'Alternative');
formData.append('duration', '245');
formData.append('musicFile', audioFile); // File object
formData.append('coverFile', coverImage); // File object
```

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Song Title",
    "artist": "Artist Name",
    "genres": ["Rock", "Alternative"],
    "duration": 245,
    "filePath": "/uploads/music/music-123.mp3",
    "coverArt": "/uploads/covers/cover-456.jpg"
  },
  "message": "Music added successfully"
}
```

#### 8. Update Music
```
PUT /api/admin/music/:id
```
**Description**: Update music metadata

**URL Parameters**:
- `id` - Music track ID

**Request Body** (JSON or FormData):
```json
{
  "title": "Updated Title",
  "artist": "Updated Artist",
  "album": "Updated Album",
  "genres": ["Rock", "Pop"],
  "duration": 250,
  "releaseDate": "2024-01-20"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated Title",
    "artist": "Updated Artist",
    ...
  },
  "message": "Music updated successfully"
}
```

#### 9. Delete Music
```
DELETE /api/admin/music/:id
```
**Description**: Delete a music track and associated files

**URL Parameters**:
- `id` - Music track ID

**Response**:
```json
{
  "success": true,
  "message": "Music deleted successfully"
}
```

---

## 🔑 Authentication Flow

### 1. Login Process
```javascript
// Step 1: Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@musicworld.com',
    password: 'Amiayan@61'
  })
});

const data = await response.json();
const token = data.data.token;

// Step 2: Store token
localStorage.setItem('token', token);

// Step 3: Use token for protected requests
const musicResponse = await fetch('http://localhost:5000/api/admin/music', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(musicData)
});
```

---

## 📊 Error Response Format

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error information (in development mode)"
}
```

**Common HTTP Status Codes**:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (not admin)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🎵 Music File Access

### Development Mode
Music files served from local server:
```
http://localhost:5000/uploads/music/music-123.mp3
http://localhost:5000/uploads/covers/cover-456.jpg
```

### Production Mode
Configure CDN URL in environment variables and files will be served from CDN.

---

## 🧪 Testing with cURL

### Get All Music
```bash
curl http://localhost:5000/api/music
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@musicworld.com","password":"Amiayan@61"}'
```

### Add Music (with token)
```bash
curl -X POST http://localhost:5000/api/admin/music \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "title=Song Title" \
  -F "artist=Artist Name" \
  -F "genres=Rock" \
  -F "duration=240" \
  -F "musicFile=@/path/to/song.mp3"
```

---

## 📱 Frontend API Service Usage

The frontend provides a service wrapper for all API calls:

```javascript
import { musicService, authService } from '../services/musicService';

// Get all music
const music = await musicService.getAllMusic({ genre: 'Rock', page: 1 });

// Add music (admin)
const formData = new FormData();
formData.append('title', 'Song');
await musicService.addMusic(formData);

// Login
await authService.login({ email, password });

// Logout
authService.logout();
```

---

## 🔧 Configuration

### Environment Variables

**Backend** (`server/.env`):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/musicworld
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
```

**Frontend** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_MUSIC_SOURCE=local
VITE_CDN_URL=
```

---

## 📝 Admin Credentials

- **Email**: `admin@musicworld.com`
- **Password**: `Amiayan@61`
- **Role**: `admin`

---

## 🚀 Quick Start Commands

```bash
# Start both frontend and backend
npm run dev

# Frontend only
cd client && npm run dev

# Backend only
cd server && npm run dev
```

**Access Points**:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Admin Panel: http://localhost:5173/admin
