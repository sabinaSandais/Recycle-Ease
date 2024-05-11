import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "./ReviewSubmit.css";
import useFetch from "../hooks/useFetch";
import PropTypes from "prop-types";

// here we need the user id to submit the review the user id 
// should be provided by the is loggin context 

const ReviewForm = ({machineId}) => {
  const [rating, setRating] = useState(1);
  const [hoverRating, setHoverRating] = useState(1);
  const [hoveredWord, setHoveredWord] = useState("Awful");
  const [comment, setComment] = useState("");
  const { isLoading, error, performFetch } = useFetch("/reviews", handleSubmit);

  const handleRatingChange = (ratingValue) => {
    setRating(ratingValue);
    setHoveredWord(getRatingWord(ratingValue));
  };

  const handleHoverRatingChange = (ratingValue) => {
    setHoverRating(ratingValue);
    setHoveredWord(getRatingWord(ratingValue));
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const review = { rating, comment };
      await performFetch({
        method: "POST",
        body: JSON.stringify(review),
      });
      
      setRating(1);
      setHoverRating(1);
      setHoveredWord("Awful");
      setComment("");
    } catch (error) {
      console.error("Error submitting review", error);
    }
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
    <form onSubmit={(event) => { event.preventDefault(); handleSubmit(); }} className="form-container">
      <div className="rating-stars">
        <label>
          <div>
            Rating: 
            {[1, 2, 3, 4, 5].map((value) => (
              <FontAwesomeIcon
                key={value}
                icon={faStar}
                className={value <= (hoverRating || rating) ? "star-filled" : "star-empty"}
                onClick={() => handleRatingChange(value)}
                onMouseEnter={() => handleHoverRatingChange(value)}
                onMouseLeave={() => handleHoverRatingChange(rating)}
              />
            ))}
          </div>
          <div>
            <span className="rating-word">{hoveredWord}</span>
          </div>
        </label>
      </div>
      <div className="comment">
        <label>
          Comment:
          <textarea value={comment} onChange={handleCommentChange} className="comment-txt"/>
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
  machineId: PropTypes.number.isRequired,
};
export default ReviewForm;
