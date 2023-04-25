import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleGameThunk } from "../../store/game";
import { addToCartThunk } from "../../store/cart";
import Reviews from "../Reviews";
import ReviewForm from "../ReviewForm";
import './GameDetails.css'

const GameDetails = () => {
  const { gameId } = useParams();
  const dispatch = useDispatch();
  const game = useSelector((state) => state.games[gameId]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);


  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const cartButton = document.querySelector(".add-button");
    if (cartButton && cartItems.includes(gameId)) {
      cartButton.textContent = "In Cart";
      cartButton.disabled = true;
      cartButton.onclick = () => {
        window.location.href = "/cart";
      };
    }
  }, [gameId]);
  

  useEffect(() => {
    const fetchGame = async () => {
      await dispatch(getSingleGameThunk(gameId));
      setLoading(false);
    };
    fetchGame();
  }, [dispatch, gameId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!game) {
    return <div>Game not found</div>;
  }



  const handleAddToCart = () => {
    dispatch(addToCartThunk(game.id));
    setShowPopup(true);
    const cartButton = document.querySelector(".add-button");
    if (cartButton) {
      cartButton.textContent = "In Cart";
      cartButton.disabled = true;
      cartButton.onclick = () => {
        window.location.href = "/cart";
      };
  
      // Save cart items to local storage
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      localStorage.setItem("cart", JSON.stringify([...cartItems, game.id]));
    }
  };
  
  

  return (
    <>
      <a className="cart-details-page" href="/cart">
        <button className="cart-button">CART</button>
      </a>
      <h1 id="details-title">{game.title}</h1>
      <div className="game-detail-container">
        <div className="top-half-container">
          <div className="left-bar">
            <div className="selected-image-container">
              <img
                className="selected-image"
                src={game.other_images[selectedImageIndex]}
                alt={game.title}
              />
            </div>
            <div className="small-images-container">
              {game.other_images.map((image, index) => (
                <img
                  key={index}
                  className={`game-detail-images ${
                    selectedImageIndex === index ? "selected" : ""
                  }`}
                  src={image}
                  alt={game.title}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>
          </div>
          <div className="right-bar">
            <div className="right-bar-container">
              <img
                className="game-detail-logo"
                src={game.image}
                alt={game.title}
              />
              <p className="side-text-details">{game.short_description}</p>
              <p className="side-text-details">
                <span className="game-detail-subtext">Release Date:</span>{" "}
                {game.release_date}
              </p>
              <p className="side-text-details">
                <span className="game-detail-subtext">Developer:</span>{" "}
                {game.developer}
              </p>
              <p className="side-text-details">
                <span className="game-detail-subtext">Publisher:</span>{" "}
                {game.publisher}
              </p>
            </div>
          </div>
        </div>
        <div className="price-container">
          <p>Buy {game.title}</p>
        </div>
        <div className="purchase-box">
          <p id="actual-price">{game.price}</p>
          <button className="add-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
          {showPopup && (
            <div className="popup">
              <p className="title-text">Item added to cart!</p>
              <div className="popup-button-container">
                <a id="cart-redirect" className="popup-buttons" href="/">
                  Continue Shopping
                </a>
                <a id="cart-redirect" className="popup-buttons" href="/cart">
                  Go to Cart
                </a>
              </div>
            </div>
          )}
        </div>
        <div className="about-container">
          <h2 className="title-text">About This Game</h2>
          <div className="full-description-container">
            <p>{game.full_description}</p>
          </div>
        </div>
        {sessionUser ? (
          <>
            <ReviewForm gameId={gameId} />
            <Reviews gameId={gameId} />
          </>
        ) : (
          <p>Please log in to leave a review</p>
          //! need to fix the profile picture and username for this to work
          // <Reviews gameId={gameId} />
        )}
      </div>
    </>
  );  
};

export default GameDetails;
