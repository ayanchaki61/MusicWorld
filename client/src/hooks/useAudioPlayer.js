import { useState, useRef, useEffect } from 'react';
import { storageService } from '../services/storageService';

export const useAudioPlayer = () => {
  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem('musicworld_volume');
    return savedVolume ? parseFloat(savedVolume) : 1;
  });

  // Load audio when track changes
  useEffect(() => {
    if (currentTrack) {
      const musicUrl = storageService.getMusicUrl(currentTrack.filePath);
      audioRef.current.src = musicUrl;
      audioRef.current.load();
      
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack]);

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      // Auto-play next track if available
      if (currentTrack && playlist.length > 0) {
        const currentIndex = playlist.findIndex(track => track._id === currentTrack._id);
        if (currentIndex < playlist.length - 1) {
          const nextTrack = playlist[currentIndex + 1];
          setCurrentTrack(nextTrack);
          setIsPlaying(true);
        }
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [currentTrack, playlist]);

  // Update volume when it changes
  useEffect(() => {
    audioRef.current.volume = volume;
    localStorage.setItem('musicworld_volume', volume.toString());
  }, [volume]);

  const play = () => {
    if (currentTrack) {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  };

  const pause = () => {
    audioRef.current.pause();
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const changeVolume = (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
  };

  const playTrack = (track) => {
    if (currentTrack?._id === track._id) {
      togglePlayPause();
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const playNextTrack = () => {
    if (!currentTrack || playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(track => track._id === currentTrack._id);
    if (currentIndex < playlist.length - 1) {
      const nextTrack = playlist[currentIndex + 1];
      setCurrentTrack(nextTrack);
      setIsPlaying(true);
    }
  };

  const playPreviousTrack = () => {
    if (!currentTrack || playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(track => track._id === currentTrack._id);
    if (currentIndex > 0) {
      const previousTrack = playlist[currentIndex - 1];
      setCurrentTrack(previousTrack);
      setIsPlaying(true);
    }
  };

  return {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    play,
    pause,
    togglePlayPause,
    seek,
    changeVolume,
    playTrack,
    setCurrentTrack,
    setPlaylist,
    playNextTrack,
    playPreviousTrack,
    hasNext: currentTrack && playlist.length > 0 && playlist.findIndex(t => t._id === currentTrack._id) < playlist.length - 1,
    hasPrevious: currentTrack && playlist.length > 0 && playlist.findIndex(t => t._id === currentTrack._id) > 0
  };
};

export default useAudioPlayer;
