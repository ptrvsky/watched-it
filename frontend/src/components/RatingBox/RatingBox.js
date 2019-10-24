import React from 'react';
import './RatingBox.scss';
import { Star } from 'react-feather';
import RateButton from './RateButton/RateButton';

export default class RatingBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      averageRating: null,
      ratesQuantity: null,
    };
    this.fetchRatingStats = this.fetchRatingStats.bind(this);
  }

  fetchRatingStats() {
    let fetchURL;
    if (this.props.rateType === 'person') fetchURL = '/api/people/' + this.props.id + '/rates/stats';
    if (this.props.rateType === 'production') fetchURL = '/api/productions/' + this.props.id + '/rates/stats';
    if (fetchURL) {
      fetch(fetchURL)
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
  }

  componentDidMount() {
    this.fetchRatingStats();
  }

  render() {
    return (
      <div className="rating-box-wrapper">
        <h3>Average rating</h3>

        <div className="avg-rating">
          <Star className="star-big" size={36} />
          <div className="rating-text">{this.state.averageRating !== null ? this.state.averageRating : null}</div>
          <div className="votes-amount">{this.state.ratesQuantity !== null ? this.state.ratesQuantity === "1" ? "(" + this.state.ratesQuantity + " vote)" : "(" + this.state.ratesQuantity + " votes)" : "Not rated yet"} </div>
        </div>
        <div className="user-rating">
          <h3>Your rating</h3>
          <RateButton rateType={this.props.rateType} id={this.props.id} fetchRatingStats={this.fetchRatingStats} />
        </div>
      </div>
    );
  }
}
