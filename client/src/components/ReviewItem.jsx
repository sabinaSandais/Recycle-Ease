import React from "react";
import PropTypes from "prop-types";
import "./ReviewItem.css";
const ReviewItem = ({ score, comment }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`star ${i < score ? "filled" : ""}`}>
          ☆
        </span>,
      );
    }
    return stars;
  };

  return (
    <div className="review-item">
      <div className="stars">{renderStars()}</div>
      <div className="comment">{comment}</div>
    </div>
  );
};

ReviewItem.propTypes = {
  score: PropTypes.number.isRequired,
  comment: PropTypes.string.isRequired,
};

export default ReviewItem;
