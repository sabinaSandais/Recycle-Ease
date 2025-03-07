import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useFetch from "../hooks/useFetch";
import "./MachineDetail.css";
import ReviewItem from "./ReviewItem";
import ReviewForm from "./ReviewSubmit";
import { useFavoriteContext } from "./FavoriteContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useApplicationContext } from "../context/applicationContext";
import { logInfo } from "../../../server/src/util/logging";
import { useMachine } from "./MachineContext";

const MachineDetail = ({ content, onClose, className }) => {
  const [reviews, setReviews] = useState([]);
  const [averageScore, setAverageScore] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isOpen, setIsOpen] = useState(content.status);
  const [showMoreReviews, setShowMoreReviews] = useState(false);

  const { user, isLoggedIn } = useApplicationContext();
  const { favoriteMachines, setFavoriteMachines } = useFavoriteContext();
  const { statusChange } = useMachine();
  const token = user.token;

  const useToggleFavorite = (token, machineId) => {
    const { performFetch: Favorite } = useFetch("/favorite");
    const toggleFavorite = async (isFavorite, setFavoriteMachines) => {
      try {
        if (isFavorite) {
          await Favorite({
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ machineId }),
          });
          setFavoriteMachines((prevMachines) =>
            prevMachines.filter((machine) => machine._id !== machineId),
          );
          return false;
        } else {
          await Favorite({
            method: "POST",
            body: JSON.stringify({ machineId }),
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          setFavoriteMachines((prevMachines) => [...prevMachines, content]);
          return true;
        }
      } catch (error) {
        logInfo("Error toggling favorite", error);
      }
    };

    return toggleFavorite;
  };

  const statusClassName = isOpen === 1 ? "open" : "closed";
  const toggleFavorite = useToggleFavorite(token, content._id);

  const handleFavoriteClick = async () => {
    const newIsFavorite = await toggleFavorite(isFavorite, setFavoriteMachines);
    setIsFavorite(newIsFavorite);
  };

  const { error: ReviewError, performFetch: fetchReviews } = useFetch(
    `/reviews/${content._id}`,
    (response) => {
      if (ReviewError) {
        setError(ReviewError);
        setIsLoading(false);
        return;
      }
      const reviewsWithFormattedDate = response.result.map((review) => ({
        ...review,
        created_at: new Date(review.created_at).toISOString(),
      }));
      setReviews(reviewsWithFormattedDate);
      setIsLoading(false);
    },
  );

  useEffect(() => {
    setIsFavorite(
      favoriteMachines.some((machine) => machine._id === content._id),
    );
  }, [favoriteMachines, content._id]);

  useEffect(() => {
    setReviews([]);
    fetchReviews();
    setIsOpen(content.status);
  }, [content]);

  useEffect(() => {
    if (reviews.length > 0) {
      const totalStars = reviews.reduce((acc, review) => acc + review.stars, 0);
      const avgScore = totalStars / reviews.length;
      setAverageScore(avgScore);
      setTotalReviews(reviews.length);
    } else {
      setAverageScore(0);
      setTotalReviews(0);
    }
  }, [reviews]);

  const handleReviewSubmit = (newReview) => {
    newReview.created_at = new Date(newReview.created_at).toISOString();
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  const toggleShowMoreReviews = () => {
    setShowMoreReviews(!showMoreReviews);
  };

  const changeStatus = (machineId, status) => {
    if (content._id === machineId) {
      setIsOpen(status);
    }
  };

  useEffect(() => {
    changeStatus(statusChange.machineId, statusChange.status);
  }, [statusChange]);

  return (
    <div className={`custom-popup ${className}`}>
      <div className="top">
        {isLoggedIn && (
          <button className="btn-f" onClick={handleFavoriteClick}>
            <FontAwesomeIcon
              icon={faHeart}
              className={`favorite-icon ${isFavorite ? "filled" : ""}`}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            />
          </button>
        )}
        <button className="btn-c" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} className="close-icon" />
        </button>
      </div>
      <div className="content">
        <div className="details">
          <ul className="machine-detail">
            <li className="name">{content.address}</li>
            <li className={statusClassName}>
              {isOpen === 1 ? "Open" : "Closed"}
            </li>
            <li className="score">
              Rating: {averageScore.toFixed(1)}/5
              <span className="total-reviews">({totalReviews} review/s)</span>
            </li>
          </ul>
        </div>
        <div className="review-form">
          {isLoggedIn ? (
            <ReviewForm
              machineId={content._id}
              onReviewSubmit={handleReviewSubmit}
              user={user}
            />
          ) : (
            <div className="msg">Please log in to submit a review.</div>
          )}
        </div>

        <div className="reviews">
          <h3>Reviews</h3>
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
                  createdAt={review.created_at}
                  userName={review.user ? review.user.name : "Anonymous"}
                />
              ))}
          {!showMoreReviews && reviews.length > 3 && (
            <button className="read-more" onClick={toggleShowMoreReviews}>
              Read More
            </button>
          )}
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
