import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useFetch from "../hooks/useFetch";
import "./MachineDetail.css";
import ReviewItem from "./ReviewItem";
import ReviewForm from "./ReviewSubmit";

const MachineDetail = ({ content, onClose, className }) => {
  const statusClassName = content.status === 1 ? "open" : "closed";

  const [reviews, setReviews] = useState([]);
  const [averageScore, setAverageScore] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMoreReviews, setShowMoreReviews] = useState(false);

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

  return (
    <div className={`custom-popup ${className}`}>
      <button className="close-btn" onClick={onClose}>
        X
      </button>
      <div className="content">
        <div className="details">
          <ul className="machine-detail">
            <li className="name">{content.address}</li>
            <li className={statusClassName}>
              {content.status === 1 ? "Open" : "Closed"}
            </li>
            <li className="score">
              Rating: {averageScore.toFixed(1)}/5
              <span className="total-reviews">
                (Total {totalReviews} review/s)
              </span>
            </li>
          </ul>
        </div>
        <div className="review-form">
          {isLoggedIn ? (
            <ReviewForm
              machineId={content._id}
              onReviewSubmit={handleReviewSubmit}
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
                  createdAt={review.created_at}
                />
              ))}
          {!showMoreReviews && reviews.length > 3 && (
            <button onClick={toggleShowMoreReviews}>Read More</button>
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
