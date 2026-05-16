const MUSIC_SOURCE = import.meta.env.VITE_MUSIC_SOURCE || 'local';
const CDN_URL = import.meta.env.VITE_CDN_URL || '';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = API_URL.replace(/\/api\/?$/, '');

const buildLocalUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const storageService = {
  // Get full URL for music file
  getMusicUrl: (filePath) => {
    if (!filePath) return '';
    
    // If it's already a full URL, return as is
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }
    
    // For local backend or deployed backend using local uploads
    if (MUSIC_SOURCE === 'local') {
      return buildLocalUrl(filePath);
    }
    
    // For CDN/production
    return `${CDN_URL}${filePath}`;
  },

  // Get full URL for cover art
  getCoverUrl: (coverPath) => {
    if (!coverPath) return '/default-cover.jpg';
    
    // If it's already a full URL, return as is
    if (coverPath.startsWith('http://') || coverPath.startsWith('https://')) {
      return coverPath;
    }
    
    // For local backend or deployed backend using local uploads
    if (MUSIC_SOURCE === 'local') {
      return buildLocalUrl(coverPath);
    }
    
    // For CDN/production
    return `${CDN_URL}${coverPath}`;
  },

  // Format duration from seconds to MM:SS
  formatDuration: (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
};

export default storageService;
