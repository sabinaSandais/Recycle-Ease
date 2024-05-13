import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useFetch from "../hooks/useFetch";
import "./MachineDetail.css";
import ReviewItem from "./ReviewItem";
import ReviewForm from "./ReviewSubmit";
import { useFavoriteContext } from "./FavoriteContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const MachineDetail = ({ content, onClose, className }) => {
  const statusClassName = content.status === 1 ? "open" : "closed";

  const [reviews, setReviews] = useState([]);
  const [averageScore, setAverageScore] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { favoriteMachines, addFavoriteMachine, removeFavoriteMachine } = useFavoriteContext(); 

  const { error: ReviewError, performFetch: fetchReviews } = useFetch(
    `/reviews/${content._id}`,
    (response) => {
      if (ReviewError) {
        setError(ReviewError);
        setIsLoading(false);
        return;
      }
      setReviews(response.result);
      setIsLoading(false);
    },
  );

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    setIsLoggedIn(token !== null);
  }, []);

  useEffect(() => {
    setReviews([]);
    fetchReviews();
  }, [content]);

  useEffect(() => {
    if (reviews.length > 0) {
      const totalStars = reviews.reduce((acc, review) => acc + review.stars, 0);
      const avgScore = totalStars / reviews.length;
      setAverageScore(avgScore);
    } else {
      setAverageScore(0);
    }
  }, [reviews]);

  const handleReviewSubmit = (newReview) => {
    setReviews((prevReviews) => [...prevReviews, newReview]);
  };
  
  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavoriteMachine(userId, content._id);
    } else {
      addFavoriteMachine(userId, content._id);
    }
  };
  
  return (
    <div className={`custom-popup ${className}`}>
      <button className="close-btn" onClick={onClose}>
        X
      </button>
      <div className="favorite-icon-container">
          {isLoggedIn && (
            <button className="favorite-btn" onClick={toggleFavorite}>
              <FontAwesomeIcon
                icon={faHeart}
                className={`favorite-icon ${isFavorite ? "filled" : ""}`}
              />
            </button>
          )}
        </div>
      <div className="content">
        <div className="details">
          <ul className="machine-detail">
            <li className="name">{content.address}</li>
            <li className={statusClassName}>
              {content.status === 1 ? "open" : "closed"}
            </li>
            <li className="score"> Score: {averageScore.toFixed(1)}/5 </li>
          </ul>
        </div>
        <div className="review-form">
          {isLoggedIn ? (
            <ReviewForm
              machineId={content._id}
              onReviewSubmit={handleReviewSubmit}
            />
          ) : (
            <div>Please log in to submit a review.</div>
          )}
        </div>
        <div className="reviews">
          <h2>Reviews</h2>
          {isLoading && <div>Loading...</div>}
          {error && <div>{error}</div>}
          {reviews &&
            reviews.length > 0 &&
            reviews.map((review, index) => (
              <ReviewItem
                key={index}
                stars={review.stars}
                comment={review.comment}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

MachineDetail.propTypes = {
  content: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default MachineDetail;
