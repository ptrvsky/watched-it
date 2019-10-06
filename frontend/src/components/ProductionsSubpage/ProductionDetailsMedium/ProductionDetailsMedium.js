import React from 'react';
import './ProductionDetailsMedium.scss';
import { Star, Eye } from 'react-feather';

export default class ProductionDetailsMedium extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      poster: null,
      director: [],
      averageRating: null,
      ratesQuantity: 0,
    }
  }

  componentDidMount() {
    fetch('/api/images/' + this.props.production.posterId)
      .then(poster => poster.json())
      .then(poster => {
        this.setState({ poster: poster.url })
      });

    fetch('/api/productions/' + this.props.production.id + '/people')
      .then(people => people.json())
      .then(people => people.filter((person) => person.role === "Director"))
      .then(directors => directors.map(director =>
        fetch('/api/people/' + director.personId)
          .then(director => director.json())
          .then(director => this.setState({ director: this.state.director.concat(director.name) }))
      ));

    fetch('/api/productions/' + this.props.production.id + '/rates/stats')
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

  render() {
    return (
      <div className="production-details-medium-wrapper">
        <div className="poster">{this.state.poster ? <img src={"/api/" + this.state.poster} alt="poster" /> : null}</div>
        <div className="eye-button"><Eye size={28} /></div>
        <div className="info">
          <div className="title">{this.props.production.title} {this.props.production.releaseDate ? "(" + this.props.production.releaseDate.slice(0, 4) + ")" : null}</div>
          <div className="rating">
            <Star className="star" size={20} /> 
            <div className="text"> {this.state.averageRating ? this.state.averageRating : null } </div>
            <div className="votes-amount"> {this.state.ratesQuantity ? this.state.ratesQuantity === "1" ? "(" + this.state.ratesQuantity + " vote)" : "(" + this.state.ratesQuantity + " votes)" : "Not rated yet"} </div>
          </div>
          <div className="details">
            <div><span className="category">Genre:</span> {this.props.production.genre.join(", ")}</div>
            <div><span className="category">Length: </span>
              {(this.props.production.length >= 60) ? parseInt(this.props.production.length / 60) + "h " : null}
              {(this.props.production.length % 60 !== 0) ? this.props.production.length % 60 + "min" : null}</div>
            <div className="director"><span className="category">Director:</span> {this.state.director.join(", ")}</div>
          </div>
        </div>
      </div>
    );
  }
}

