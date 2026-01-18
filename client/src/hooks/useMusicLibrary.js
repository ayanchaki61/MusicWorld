import { useState, useEffect } from 'react';
import { musicService } from '../services/musicService';

export const useMusicLibrary = (initialGenre = 'all') => {
  const [music, setMusic] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedArtist, setSelectedArtist] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [artists, setArtists] = useState([]);

  // Fetch music based on filters
  const fetchMusic = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: currentPage,
        limit: 20
      };
      
      if (selectedGenre && selectedGenre !== 'all') {
        params.genre = selectedGenre;
      }
      
      if (selectedLanguage && selectedLanguage !== 'all') {
        params.language = selectedLanguage;
      }
      
      if (selectedArtist && selectedArtist !== 'all') {
        params.artist = selectedArtist;
      }
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      const response = await musicService.getAllMusic(params);
      setMusic(response.data);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err.message || 'Failed to fetch music');
      console.error('Error fetching music:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available genres
  const fetchGenres = async () => {
    try {
      const response = await musicService.getGenres();
      setGenres(['all', ...response.data]);
    } catch (err) {
      console.error('Error fetching genres:', err);
    }
  };

  // Fetch available languages
  const fetchLanguages = async () => {
    try {
      const response = await musicService.getLanguages();
      // Filter out any empty values and add 'all' option
      const validLanguages = response.data.filter(lang => lang && lang.trim() !== '');
      setLanguages(['all', ...validLanguages]);
    } catch (err) {
      console.error('Error fetching languages:', err);
    }
  };
  // Fetch available artists
  const fetchArtists = async () => {
    try {
      const response = await musicService.getArtists();
      // Filter out any empty values from response
      const validArtists = response.data.filter(artist => artist && artist.trim() !== '');
      setArtists(['all', ...validArtists]);
    } catch (err) {
      console.error('Error fetching artists:', err);
    }
  };
  // Initial load
  useEffect(() => {
    fetchGenres();
    fetchLanguages();
    fetchArtists();
  }, []);

  // Fetch music when filters change
  useEffect(() => {
    fetchMusic();
  }, [selectedGenre, selectedLanguage, selectedArtist, searchQuery, currentPage]);

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setCurrentPage(1);
  };

  const handleArtistChange = (artist) => {
    setSelectedArtist(artist);
    setCurrentPage(1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const refresh = () => {
    fetchMusic();
  };

  return {
    music,
    setMusic,
    loading,
    error,
    selectedGenre,
    selectedLanguage,
    selectedArtist,
    searchQuery,
    currentPage,
    totalPages,
    genres,
    languages,
    artists,
    setSelectedGenre: handleGenreChange,
    setSelectedLanguage: handleLanguageChange,
    setSelectedArtist: handleArtistChange,
    setSearchQuery: handleSearch,
    setCurrentPage,
    refresh
  };
};

export default useMusicLibrary;
