import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "./ReviewSubmit.css";
import PropTypes from "prop-types";
import useFetch from "../hooks/useFetch";
import ReviewAlert from "./ReviewAlert";

const ReviewForm = ({ machineId, onReviewSubmit, user }) => {
  const [stars, setStars] = useState(1);
  const [hoverStars, setHoverStars] = useState(1);
  const [hoveredWord, setHoveredWord] = useState("Awful");
  const [comment, setComment] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleReceived = () => {
    onReviewSubmit({
      stars,
      comment,
      machineId,
      created_at: new Date().toISOString(),
      user: { name: user.name, id: user.id },
    });
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

    if (!comment) {
      setAlertMessage("Please provide a comment.");
      setAlertVisible(true);
      return;
    }
    const review = {
      stars,
      comment,
      machineId,
      userId: user.id,
      userName: user.name,
    };
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
    <>
      {alertVisible && (
        <ReviewAlert
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      )}
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
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? "Loading..." : "Submit"}
        </button>
        {error && <p className="error-msg">{error.toString()}</p>}
      </form>
    </>
  );
};

ReviewForm.propTypes = {
  machineId: PropTypes.string.isRequired,
  onReviewSubmit: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default ReviewForm;
