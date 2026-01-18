import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, musicService } from '../services/musicService';
import AdminMusicForm from '../components/Admin/AdminMusicForm';
import useMusicLibrary from '../hooks/useMusicLibrary';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const musicLibrary = useMusicLibrary();
  const user = authService.getCurrentUser();
  const [editingTrack, setEditingTrack] = React.useState(null);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleEdit = (track) => {
    setEditingTrack(track);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTrack(null);
  };

  const handleSuccess = () => {
    musicLibrary.refresh();
    setEditingTrack(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this music?')) {
      try {
        await musicService.deleteMusic(id);
        musicLibrary.refresh();
        alert('Music deleted successfully');
      } catch (error) {
        alert('Failed to delete music: ' + error.message);
      }
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-header-actions">
          <span>Welcome, {user?.username}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <AdminMusicForm 
        onSuccess={handleSuccess} 
        editingTrack={editingTrack}
        onCancelEdit={handleCancelEdit}
      />

      <div className="admin-music-list">
        <h2>Music Library</h2>
        {musicLibrary.loading ? (
          <p>Loading...</p>
        ) : musicLibrary.error ? (
          <p className="error">{musicLibrary.error}</p>
        ) : (
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Artist</th>
                  <th>Language</th>
                  <th>Genres</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {musicLibrary.music.map((track) => (
                  <tr key={track._id} className={editingTrack?._id === track._id ? 'editing' : ''}>
                    <td>{track.title}</td>
                    <td>{track.artist}</td>
                    <td>{track.language || 'English'}</td>
                    <td>{track.genres.join(', ')}</td>
                    <td>{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</td>
                    <td className="action-buttons">
                      <button 
                        onClick={() => handleEdit(track)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(track._id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
