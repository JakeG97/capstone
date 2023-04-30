import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllLibraryGamesThunk, removeGameThunk } from '../../store/library';
import UpdateGame from '../LibraryUpdate';
import './Library.css';
import loadingGif from "../HomePage/loading-2.gif"

const Library = () => {
  const dispatch = useDispatch();
  const library = useSelector((state) => {
    console.log('Library state:', state.library);
    return state.library;
  });
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchLibrary = async () => {
      await dispatch(getAllLibraryGamesThunk());
      setIsLoaded(true);
    };
    fetchLibrary();
  }, [dispatch]);

  const handleRemove = async (game) => {
    await dispatch(removeGameThunk(game.game_id));
  };

  const handleUpdateClick = (game) => {
    console.log('Selected game ID:', game.game_id);
    setShowUpdateForm(true);
    setSelectedGame(game);
  };

  const handleFormClose = () => {
    setShowUpdateForm(false);
    setSelectedGame(null);
  };

  return (
    <>
      {!isLoaded ? (
        <div className="loading-container">
          <img  className="loading-gif" src={loadingGif} alt="Loading..." />
        </div>
      ) : (
        <div className="library">
          <h2 className="library-title">Library</h2>
          {Object.values(library).length === 0 ? (
            <div className="no-games">
              <p>Looks like you don't have any games in your library yet...</p>
              <Link to="/">
                <button>Let's change that!</button>
              </Link>
            </div>
          ) : (
            Object.values(library).map((game) => (
              <div key={game.id}>
                <div className="game-card">
                  <img
                    className="games-list-image"
                    src={game.banner_image}
                    alt={game.title}
                  />
                  <h2 className="cart-game-titles">{game.title}</h2>
                  <button
                    className="remove-button"
                    onClick={() => handleRemove(game)}
                  >
                    Remove
                  </button>
                  <button
                    className="review-buttons"
                    onClick={() => handleUpdateClick(game)}
                  >
                    Update
                  </button>
                </div>
                {showUpdateForm && selectedGame?.id === game.id && (
                  <UpdateGame game={selectedGame} onClose={handleFormClose} />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
};

export default Library;
