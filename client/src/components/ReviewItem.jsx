import React from "react";
import PropTypes from "prop-types";
import "./ReviewItem.css";

const ReviewItem = ({ stars, comment }) => {
  const renderStars = () => {
    const starsArray = [];
    const starsValue = stars;
    for (let i = 0; i < 5; i++) {
      starsArray.push(
        <span key={i} className={`star ${i < starsValue ? "filled" : "empty"}`}>
          ☆
        </span>,
      );
    }
    return starsArray;
  };

  return (
    <div className="review-item">
      <div className="stars">{renderStars()}</div>
      <div className="comment">{comment}</div>
    </div>
  );
};

ReviewItem.propTypes = {
  stars: PropTypes.number,
  comment: PropTypes.string.isRequired,
};

export default ReviewItem;
