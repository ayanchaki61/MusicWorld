import React, { useState, useEffect } from 'react';
import { musicService } from '../../services/musicService';
import { genres } from '../../config/genres';
import { languages } from '../../config/languages';
import './AdminMusicForm.css';

const AdminMusicForm = ({ onSuccess, editingTrack, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genres: [],
    language: 'English',
    duration: '',
    releaseDate: '',
    filePath: ''
  });
  const [musicFile, setMusicFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useUrl, setUseUrl] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editingTrack) {
      setFormData({
        title: editingTrack.title || '',
        artist: editingTrack.artist || '',
        album: editingTrack.album || '',
        genres: editingTrack.genres || [],
        language: editingTrack.language || 'English',
        duration: editingTrack.duration || '',
        releaseDate: editingTrack.releaseDate ? editingTrack.releaseDate.split('T')[0] : '',
        filePath: editingTrack.filePath || ''
      });
      setUseUrl(false);
      setMusicFile(null);
      setCoverFile(null);
    }
  }, [editingTrack]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenreToggle = (genre) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'musicFile') {
      setMusicFile(files[0]);
    } else if (name === 'coverFile') {
      setCoverFile(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingTrack) {
        // Update existing music
        const updateData = {
          title: formData.title,
          artist: formData.artist,
          album: formData.album,
          genres: formData.genres,
          language: formData.language,
          duration: formData.duration,
          releaseDate: formData.releaseDate
        };
        
        await musicService.updateMusic(editingTrack._id, updateData);
        alert('Music updated successfully!');
      } else {
        // Add new music
        const submitData = new FormData();
        submitData.append('title', formData.title);
        submitData.append('artist', formData.artist);
        submitData.append('album', formData.album);
        formData.genres.forEach(genre => {
          submitData.append('genres', genre);
        });
        submitData.append('language', formData.language);
        submitData.append('duration', formData.duration);
        submitData.append('releaseDate', formData.releaseDate);

        if (useUrl) {
          submitData.append('filePath', formData.filePath);
        } else if (musicFile) {
          submitData.append('musicFile', musicFile);
        }

        if (coverFile) {
          submitData.append('coverFile', coverFile);
        }

        await musicService.addMusic(submitData);
        alert('Music added successfully!');
      }
      
      // Reset form
      setFormData({
        title: '',
        artist: '',
        album: '',
        genres: [],
        language: 'English',
        duration: '',
        releaseDate: '',
        filePath: ''
      });
      setMusicFile(null);
      setCoverFile(null);
      
      if (onSuccess) onSuccess();
      if (onCancelEdit) onCancelEdit();
    } catch (err) {
      setError(err.message || `Failed to ${editingTrack ? 'update' : 'add'} music`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      artist: '',
      album: '',
      genres: [],
      language: 'English',
      duration: '',
      releaseDate: '',
      filePath: ''
    });
    setMusicFile(null);
    setCoverFile(null);
    setError(null);
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <form className="admin-music-form" onSubmit={handleSubmit}>
      <h2>{editingTrack ? 'Edit Music' : 'Add New Music'}</h2>
      
      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label>Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Artist *</label>
        <input
          type="text"
          name="artist"
          value={formData.artist}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Album</label>
        <input
          type="text"
          name="album"
          value={formData.album}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Genres *</label>
        <div className="genre-select">
          {genres.map(genre => (
            <label key={genre} className="genre-checkbox">
              <input
                type="checkbox"
                checked={formData.genres.includes(genre)}
                onChange={() => handleGenreToggle(genre)}
              />
              <span>{genre}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Language *</label>
        <select
          name="language"
          value={formData.language}
          onChange={handleChange}
          required
        >
          {languages.map(language => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Duration (seconds) *</label>
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Release Date</label>
        <input
          type="date"
          name="releaseDate"
          value={formData.releaseDate}
          onChange={handleChange}
        />
      </div>

      {!editingTrack && (
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={useUrl}
              onChange={(e) => setUseUrl(e.target.checked)}
            />
            Use URL instead of file upload
          </label>
        </div>
      )}

      {useUrl ? (
        <div className="form-group">
          <label>Music URL *</label>
          <input
            type="url"
            name="filePath"
            value={formData.filePath}
            onChange={handleChange}
            required={useUrl}
          />
        </div>
      ) : (
        <div className="form-group">
          <label>Music File {!editingTrack && '*'}</label>
          <input
            type="file"
            name="musicFile"
            accept="audio/*"
            onChange={handleFileChange}
            required={!useUrl && !editingTrack}
          />
        </div>
      )}

      <div className="form-group">
        <label>Cover Art</label>
        <input
          type="file"
          name="coverFile"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <div className="form-buttons">
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? (editingTrack ? 'Updating...' : 'Adding...') : (editingTrack ? 'Update Music' : 'Add Music')}
        </button>
        {editingTrack && (
          <button type="button" onClick={handleCancel} className="cancel-button">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AdminMusicForm;
