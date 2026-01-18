# MusicWorld 🎵

A full-stack music streaming web application built with React, Node.js, Express, and MongoDB.

## Features

- 🎵 Browse and play music tracks
- 🎨 Filter music by genres
- 🔍 Search functionality for tracks and artists
- 🎧 Audio player with playback controls
- 👤 Admin panel for music management
- 🔐 JWT-based authentication
- 📱 Responsive design

## Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- Bcrypt for password hashing

## Project Structure

```
MusicWorld/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   └── config/        # Configuration files
│   └── package.json
├── server/                # Express backend
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   └── server.js         # Entry point
└── .github/
    └── copilot-instructions.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd MusicWorld
```

2. **Set up Backend**
```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

3. **Set up Frontend**
```bash
cd client
npm install

# Create .env file
cp .env.example .env
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

5. **Run the Application**

Backend (from `server/` directory):
```bash
npm run dev
```

Frontend (from `client/` directory):
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Public Endpoints
- `GET /api/music` - Get all music (with filters)
- `GET /api/music/:id` - Get single music track
- `GET /api/music/genres` - Get all genres
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user

### Protected Endpoints (Admin Only)
- `POST /api/admin/music` - Add new music
- `PUT /api/admin/music/:id` - Update music
- `DELETE /api/admin/music/:id` - Delete music

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/musicworld
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
UPLOAD_PATH=./uploads/music
COVER_PATH=./uploads/covers
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_MUSIC_SOURCE=local
VITE_CDN_URL=
```

## Usage

### Admin Access
1. Register a new user via API or create manually in MongoDB
2. Update user role to 'admin' in database
3. Login at `/login`
4. Access admin panel at `/admin`

### Adding Music
- **Development**: Upload audio files directly through admin panel
- **Production**: Provide CDN URLs for music files

## Development

### Running Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

### Building for Production
```bash
# Build frontend
cd client
npm run build

# The build output will be in client/dist/
```

## Deployment

### Backend
1. Set up MongoDB Atlas or other cloud MongoDB
2. Configure environment variables
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend
1. Build the frontend
2. Deploy to Vercel, Netlify, or serve via Express

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

Built with ❤️ for music lovers
