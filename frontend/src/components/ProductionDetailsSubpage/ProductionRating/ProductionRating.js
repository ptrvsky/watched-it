import React from 'react';
import './ProductionRating.scss';
import { Star } from 'react-feather';
import RateButton from './RateButton/RateButton';

export default class ProductionRating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      averageRating: null,
      ratesQuantity: null,
    };
    this.fetchRatingStats = this.fetchRatingStats.bind(this);
  }

  fetchRatingStats() {
    fetch('/api/productions/' + this.props.productionId + '/rates/stats')
      .then((ratingStats) => ratingStats.json())
      .then((ratingStats) => {
        if (ratingStats.quantity > 0) {
          this.setState({
            averageRating: Number(ratingStats.average).toFixed(2),
            ratesQuantity: ratingStats.quantity,
          });
        }
      });
  }

  componentDidMount() {
    this.fetchRatingStats();
  }

  render() {
    return (
      <div className="production-rating-wrapper">
        <h3>Average rating</h3>

        <div className="avg-rating">
          <Star className="star-big" size={36} />
          <div className="rating-text">{this.state.averageRating !== null ? this.state.averageRating : null}</div>
          <div className="votes-amount">{this.state.ratesQuantity !== null ? this.state.ratesQuantity === "1" ? "(" + this.state.ratesQuantity + " vote)" : "(" + this.state.ratesQuantity + " votes)" : "Not rated yet"} </div>
        </div>
        <div className="user-rating">
          <h3>Your rating</h3>
          <RateButton productionId={this.props.productionId} fetchRatingStats={this.fetchRatingStats} />
        </div>
      </div>
    );
  }
}
