import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStarHalfAlt as halfStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import PropTypes from "prop-types";

const StarRating = ({ rating }) => {

  const clampedRating = Math.max(0, Math.min(5, rating));

  const filledStars = Math.floor(clampedRating);
  const hasHalfStar = clampedRating - filledStars >= 0.5;

  const stars = [];

  for (let i = 1; i <= filledStars; i++) {
    stars.push(<FontAwesomeIcon key={i} icon={solidStar} />);
  }

  if (hasHalfStar) {
    stars.push(<FontAwesomeIcon key={filledStars + 1} icon={halfStar} />);
  }

  for (let i = filledStars + (hasHalfStar ? 2 : 1); i <= 5; i++) {
    stars.push(<FontAwesomeIcon key={i} icon={regularStar} />);
  }

  let colorClass = '';
  if (rating < 2.5) {
    colorClass = 'red';
  } else if (rating < 3.5) {
    colorClass = 'orange';
  } else {
    colorClass = 'green';
  }

  return <div className={`star-rating ${colorClass}`}>{stars}</div>;
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

export default StarRating;
