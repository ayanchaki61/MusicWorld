import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { musicService } from '../../services/musicService';
import './MusicList.css';

const MusicList = ({ music, onPlayTrack, currentTrack, isPlaying, onVoteUpdate }) => {
  const [votingState, setVotingState] = useState({});

  const handleVote = async (e, trackId, voteType) => {
    e.stopPropagation();
    
    // Prevent multiple clicks
    if (votingState[trackId]) return;
    
    setVotingState(prev => ({ ...prev, [trackId]: true }));
    
    try {
      const response = voteType === 'up' 
        ? await musicService.upvoteMusic(trackId)
        : await musicService.downvoteMusic(trackId);
      
      if (response.success && onVoteUpdate) {
        onVoteUpdate(trackId, response.data);
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setVotingState(prev => ({ ...prev, [trackId]: false }));
    }
  };

  if (!music || music.length === 0) {
    return (
      <div className="music-list-empty">
        <p>No music found</p>
      </div>
    );
  }

  return (
    <div className="music-list">
      {music.map((track) => {
        const isCurrentTrack = currentTrack?._id === track._id;
        
        return (
          <div
            key={track._id}
            className={`music-item ${isCurrentTrack ? 'active' : ''}`}
            onClick={() => onPlayTrack(track)}
          >
            <div className="music-item-cover">
              <img 
                src={storageService.getCoverUrl(track.coverArt)} 
                alt={track.title}
              />
              <div className="music-item-play-overlay">
                {isCurrentTrack && isPlaying ? '⏸' : '▶'}
              </div>
            </div>
            
            <div className="music-item-info">
              <h4>{track.title}</h4>
              <p>{track.artist}</p>
              {track.album && <p className="music-item-album">{track.album}</p>}
              {track.language && <p className="music-item-language">🌐 {track.language}</p>}
              
              <div className="music-item-votes">
                <button
                  className="vote-btn upvote"
                  onClick={(e) => handleVote(e, track._id, 'up')}
                  disabled={votingState[track._id]}
                  title="Upvote"
                >
                  <span className="vote-icon">👍</span>
                  <span className="vote-count">{track.upvotes || 0}</span>
                </button>
                <button
                  className="vote-btn downvote"
                  onClick={(e) => handleVote(e, track._id, 'down')}
                  disabled={votingState[track._id]}
                  title="Downvote"
                >
                  <span className="vote-icon">👎</span>
                  <span className="vote-count">{track.downvotes || 0}</span>
                </button>
              </div>
            </div>
            
            <div className="music-item-meta">
              <span className="music-item-genres">
                {track.genres.join(', ')}
              </span>
              <span className="music-item-duration">
                {storageService.formatDuration(track.duration)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MusicList;
