import React from "react";
import PropTypes from "prop-types";
import "./ReviewItem.css";

const ReviewItem = ({ stars, comment, createdAt, userName }) => {
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

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="review-item">
      <div className="flex">
        <div className="comment">{comment}</div>
        <div className="stars">{renderStars()}</div>
      </div>
      <div className="flex">
        <div className="user-name"> @{userName}</div>
        <div className="created-at">{formatDate(createdAt)}</div>
      </div>
    </div>
  );
};

ReviewItem.propTypes = {
  stars: PropTypes.number.isRequired,
  comment: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

export default ReviewItem;
