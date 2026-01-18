import React from 'react';
import MusicList from '../components/MusicList/MusicList';
import GenreFilter from '../components/GenreFilter/GenreFilter';
import Player from '../components/Player/Player';
import useAudioPlayer from '../hooks/useAudioPlayer';
import useMusicLibrary from '../hooks/useMusicLibrary';
import './Home.css';

const Home = () => {
  const audioPlayer = useAudioPlayer();
  const musicLibrary = useMusicLibrary();

  const handleVoteUpdate = (trackId, voteData) => {
    // Update the vote counts in the music library
    musicLibrary.setMusic(prevMusic => 
      prevMusic.map(track => 
        track._id === trackId 
          ? { ...track, upvotes: voteData.upvotes, downvotes: voteData.downvotes }
          : track
      )
    );
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>Melodify.in</h1>
        <p>Your Ultimate Music Streaming Experience with - <em>Ayan Chaki</em></p>
      </div>

      <GenreFilter
        genres={musicLibrary.genres}
        selectedGenre={musicLibrary.selectedGenre}
        onGenreChange={musicLibrary.setSelectedGenre}
        searchQuery={musicLibrary.searchQuery}
        onSearchChange={musicLibrary.setSearchQuery}
      />

      {/* Language and Artist Filters */}
      <div className="filters-container">
        <div className="language-filter">
          <label>Language:</label>
          <select
            value={musicLibrary.selectedLanguage}
            onChange={(e) => musicLibrary.setSelectedLanguage(e.target.value)}
            className="language-select"
          >
            {musicLibrary.languages.map(language => (
              <option key={language} value={language}>
                {language === 'all' ? 'All Languages' : language}
              </option>
            ))}
          </select>
        </div>

        <div className="artist-filter">
          <label>Artist:</label>
          <select
            value={musicLibrary.selectedArtist}
            onChange={(e) => musicLibrary.setSelectedArtist(e.target.value)}
            className="artist-select"
          >
            {musicLibrary.artists.map(artist => (
              <option key={artist} value={artist}>
                {artist === 'all' ? 'All Artists' : artist}
              </option>
            ))}
          </select>
        </div>
      </div>

      {musicLibrary.loading ? (
        <div className="loading">Loading music...</div>
      ) : musicLibrary.error ? (
        <div className="error">{musicLibrary.error}</div>
      ) : (
        <>
          <MusicList
            music={musicLibrary.music}
            onPlayTrack={audioPlayer.playTrack}
            currentTrack={audioPlayer.currentTrack}
            isPlaying={audioPlayer.isPlaying}
            onVoteUpdate={handleVoteUpdate}
          />

          {musicLibrary.totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={musicLibrary.currentPage === 1}
                onClick={() => musicLibrary.setCurrentPage(musicLibrary.currentPage - 1)}
              >
                Previous
              </button>
              <span>
                Page {musicLibrary.currentPage} of {musicLibrary.totalPages}
              </span>
              <button
                disabled={musicLibrary.currentPage === musicLibrary.totalPages}
                onClick={() => musicLibrary.setCurrentPage(musicLibrary.currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <Player
        currentTrack={audioPlayer.currentTrack}
        isPlaying={audioPlayer.isPlaying}
        currentTime={audioPlayer.currentTime}
        duration={audioPlayer.duration}
        volume={audioPlayer.volume}
        onTogglePlayPause={audioPlayer.togglePlayPause}
        onSeek={audioPlayer.seek}
        onVolumeChange={audioPlayer.changeVolume}
      />
    </div>
  );
};

export default Home;
