import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "./ReviewSubmit.css";
import PropTypes from "prop-types";
import useFetch from "../hooks/useFetch";

const ReviewForm = ({ machineId, onReviewSubmit }) => {
  const [stars, setStars] = useState(1);
  const [hoverStars, setHoverStars] = useState(1);
  const [hoveredWord, setHoveredWord] = useState("Awful");
  const [comment, setComment] = useState("");

  const handleReceived = () => {
    onReviewSubmit({ stars, comment, machineId });
    setStars(1);
    setHoverStars(1);
    setHoveredWord("Awful");
    setComment("");
  };
  const { isLoading, error, performFetch } = useFetch(
    `/reviews/${machineId}`,
    handleReceived,
  );

  const handleStarsChange = (starsValue) => {
    setStars(starsValue);
    setHoveredWord(getRatingWord(starsValue));
  };

  const handleHoverStarsChange = (starsValue) => {
    setHoverStars(starsValue);
    setHoveredWord(getRatingWord(starsValue));
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stars || !comment) {
      alert("Please provide a star rating and comment.");
      return;
    }
    const review = { stars, comment, machineId };
    performFetch({
      method: "POST",
      body: JSON.stringify(review),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const getRatingWord = (value) => {
    switch (value) {
      case 1:
        return "Awful";
      case 2:
        return "Bad";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "Awful";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="rating-stars" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((value) => (
          <FontAwesomeIcon
            key={value}
            icon={faStar}
            className={
              value <= (hoverStars || stars) ? "star-filled" : "star-empty"
            }
            onClick={() => handleStarsChange(value)}
            onMouseEnter={() => handleHoverStarsChange(value)}
            onMouseLeave={() => handleHoverStarsChange(stars)}
          />
        ))}
      </div>
      <p className="rating-word">{hoveredWord}</p>
      <div className="comment">
        <label htmlFor="comment">
          Comment:
          <textarea
            id="comment"
            name="comment"
            value={comment}
            onChange={handleCommentChange}
            className="comment-txt"
          />
        </label>
      </div>
      <button type="submit" className="review-btn" disabled={isLoading}>
        {isLoading ? "Loading..." : "Submit"}
      </button>
      {error && <p className="error-msg">{error.toString()}</p>}
    </form>
  );
};

ReviewForm.propTypes = {
  machineId: PropTypes.string.isRequired,
  onReviewSubmit: PropTypes.func.isRequired,
};

export default ReviewForm;
