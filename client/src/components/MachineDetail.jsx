import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useFetch from "../hooks/useFetch";
import "./MachineDetail.css";
import ReviewItem from "./ReviewItem";
import ReviewForm from "./ReviewSubmit";
import { useFavoriteContext } from "./FavoriteContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useApplicationContext } from "../context/applicationContext";
import { logInfo } from "../../../server/src/util/logging";

const MachineDetail = ({ content, onClose, className }) => {
  const useToggleFavorite = (token, machineId) => {
    const { performFetch: addFavorite } = useFetch("/favorite");
    const { performFetch: removeFavorite } = useFetch("/favorite");

    const toggleFavorite = async (isFavorite, setFavoriteMachines) => {
      try {
        if (isFavorite) {
          await removeFavorite({
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ machineId }),
          });
          setFavoriteMachines((prevMachines) =>
            prevMachines.filter((id) => id !== machineId),
          );
        } else {
          await addFavorite({
            method: "POST",
            body: JSON.stringify({ machineId }),
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          setFavoriteMachines((prevMachines) => [...prevMachines, content]);
        }
      } catch (error) {
        logInfo("Error toggling favorite", error);
      }
    };

    return toggleFavorite;
  };

  const statusClassName = content.status === 1 ? "open" : "closed";

  const [reviews, setReviews] = useState([]);
  const [averageScore, setAverageScore] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { user } = useApplicationContext();
  const token = user.token;
  const { setFavoriteMachines } = useFavoriteContext();

  const toggleFavorite = useToggleFavorite(token, content._id);

  const handleFavoriteClick = () => {
    toggleFavorite(isFavorite, setFavoriteMachines);
    setIsFavorite((prevIsFavorite) => !prevIsFavorite);
  };
  const { performFetch: getFavoriteMachines, error: favoriteError } = useFetch(
    "/favorite",
    (response) => {
      if (response.success) {
        setFavoriteMachines(response.machines);
        setIsLoading(false);
        setIsFavorite(
          response.machines.some((machine) => machine._id === content._id),
        );
      }
      if (favoriteError) setError(favoriteError);
      setIsLoading(false);
    },
  );

  useEffect(() => {
    if (!isLoggedIn) return;
    getFavoriteMachines({ headers: { Authorization: `Bearer ${token}` } });
  }, [content]);

  const [showMoreReviews, setShowMoreReviews] = useState(false);

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
    setIsLoggedIn(!!token);
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

  const toggleShowMoreReviews = () => {
    setShowMoreReviews(!showMoreReviews);
  };

  return (
    <div className={`custom-popup ${className}`}>
      <div className="top">
        <div className="favorite-icon-container">
          {isLoggedIn && (
            <button className="favorite-btn" onClick={handleFavoriteClick}>
              <FontAwesomeIcon
                icon={faHeart}
                className={`favorite-icon ${isFavorite ? "filled" : ""}`}
                title={
                  isFavorite ? "Remove from Favorites" : "Add to Favorites"
                }
              />
            </button>
          )}
        </div>
        <button className="close-btn" onClick={onClose}>
          X
        </button>
      </div>
      <div className="content">
        <div className="details">
          <ul className="machine-detail">
            <li className="name">{content.address}</li>
            <li className={statusClassName}>
              {content.status === 1 ? "Open" : "Closed"}
            </li>
            <li className="score"> Rating: {averageScore.toFixed(1)}/5 </li>
          </ul>
        </div>
        <div className="review-form">
          {isLoggedIn ? (
            <ReviewForm
              machineId={content._id}
              onReviewSubmit={(newReview) =>
                setReviews((prevReviews) => [...prevReviews, newReview])
              }
            />
          ) : (
            <div className="msg">Please log in to submit a review.</div>
          )}
        </div>

        <div className="reviews">
          <h2>Reviews</h2>
          {isLoading && <div>Loading...</div>}
          {error && <div>{error}</div>}
          {reviews &&
            reviews
              .slice(0, showMoreReviews ? reviews.length : 3)
              .map((review, index) => (
                <ReviewItem
                  key={index}
                  stars={review.stars}
                  comment={review.comment}
                />
              ))}
          {!showMoreReviews && reviews.length > 3 && (
            <button onClick={toggleShowMoreReviews}>Read More</button>
          )}
          {reviews.map((review, index) => (
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
