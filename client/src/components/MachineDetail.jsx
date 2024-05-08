import React from "react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import "./MachineDetail.css";
import ReviewItem from "./ReviewItem";

const MachineDetail = ({ content, onClose, className }) => {
  const statusClassName = content.status === 1 ? "open" : "closed";

  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    fetchReviews();
  }, []);

  return (
    <div className={`custom-popup ${className}`}>
      <button className="close-btn" onClick={onClose}>
        X
      </button>
      <div className="content">
        <div className="details">
          <ul className="machine-detail">
            <li>{content.address}</li>
            <li className={statusClassName}>
              {content.status === 1 ? "open" : "closed"}
            </li>
          </ul>
        </div>
        <div className="reviews">
          <h2>Reviews</h2>
          {isLoading && <div>Loading...</div>}
          {error && <div>{error}</div>}

          {reviews.map((review) => (
            <ReviewItem
              key={review._id}
              score={review.stars}
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
