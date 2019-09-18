import React from 'react';
import './ProductionRating.scss';
import { Star } from 'react-feather';
import RateButton from './RateButton/RateButton';

export default class ProductionRating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avgRating: null,
      userRating: null,
    };
    this.handleRatingChange = this.handleRatingChange.bind(this);
  }

  handleRatingChange(newRating) {
    {/* Logic that send new user rating to backend */}
    this.setState({
      userRating: newRating
    })
  }

  render() {
    return (
      <div className="production-rating-wrapper">
        <div className="avg-rating">
          <Star className="star-big" size={36} />
          <div className="rating-text">9,11</div>
          <div className="votes-amount">(132548 votes)</div>
        </div>
        <div className="user-rating">
          <h3>Your rating</h3>
          <RateButton rate={this.state.userRating} handleRatingChange={this.handleRatingChange} />
        </div>
      </div>
    );
  }
}
