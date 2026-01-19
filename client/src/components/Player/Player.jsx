import React from 'react';
import { storageService } from '../../services/storageService';
import './Player.css';

const Player = ({ 
  currentTrack, 
  isPlaying, 
  currentTime, 
  duration, 
  volume,
  onTogglePlayPause,
  onSeek,
  onVolumeChange,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious
}) => {
  if (!currentTrack) {
    return (
      <div className="player">
        <div className="player-empty">
          <p>Select a track to start playing</p>
        </div>
      </div>
    );
  }

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    onSeek(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="player">
      <div className="player-track-info">
        <img 
          src={storageService.getCoverUrl(currentTrack.coverArt)} 
          alt={currentTrack.title}
          className="player-cover"
        />
        <div className="player-details">
          <h3>{currentTrack.title}</h3>
          <p>{currentTrack.artist}</p>
          {currentTrack.album && <p className="player-album">{currentTrack.album}</p>}
        </div>
      </div>

      <div className="player-controls">
        <button 
          className="player-nav-button"
          onClick={onPrevious}
          disabled={!hasPrevious}
          title="Previous Track"
        >
          ⏮
        </button>
        
        <button 
          className="player-play-button"
          onClick={onTogglePlayPause}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        
        <button 
          className="player-nav-button"
          onClick={onNext}
          disabled={!hasNext}
          title="Next Track"
        >
          ⏭
        </button>
        
        <div className="player-progress">
          <span className="player-time">{storageService.formatDuration(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="player-slider"
            style={{
              background: `linear-gradient(to right, #1db954 0%, #1db954 ${progress}%, #404040 ${progress}%, #404040 100%)`
            }}
          />
          <span className="player-time">{storageService.formatDuration(duration)}</span>
        </div>

        <div className="player-volume">
          <span>🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="player-slider volume-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
