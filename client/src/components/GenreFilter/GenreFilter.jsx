import React from 'react';
import './GenreFilter.css';

const GenreFilter = ({ genres, selectedGenre, onGenreChange, searchQuery, onSearchChange }) => {
  return (
    <div className="genre-filter">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search music..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="genre-chips">
        {genres.map((genre) => (
          <button
            key={genre}
            className={`genre-chip ${selectedGenre === genre ? 'active' : ''}`}
            onClick={() => onGenreChange(genre)}
          >
            {genre === 'all' ? 'All Genres' : genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter;
