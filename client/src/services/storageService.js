const MUSIC_SOURCE = import.meta.env.VITE_MUSIC_SOURCE || 'local';
const CDN_URL = import.meta.env.VITE_CDN_URL || '';

export const storageService = {
  // Get full URL for music file
  getMusicUrl: (filePath) => {
    if (!filePath) return '';
    
    // If it's already a full URL, return as is
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }
    
    // For local development
    if (MUSIC_SOURCE === 'local') {
      return filePath;
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
    
    // For local development
    if (MUSIC_SOURCE === 'local') {
      return coverPath;
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
