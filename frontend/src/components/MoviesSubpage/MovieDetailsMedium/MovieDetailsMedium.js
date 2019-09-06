import React from 'react';
import './MovieDetailsMedium.scss';
import { Star, Eye } from 'react-feather';

export default class MovieDetailsMedium extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      poster: null
    }
  }

  componentDidMount() {
    fetch('/api/images/' + this.props.movie.posterId)
      .then(poster => poster.json())
      .then(poster => this.setState({ poster }));
  }

  render() {
    return (
      <div className="movie-details-medium-wrapper">
        <div className="poster"><img src={"/api/" + this.state.posterURL} alt="poster" /></div>
        <div className="eye-button"><Eye size={28} /></div>
        <div className="info">
          <div className="title">{this.props.movie.title} ({this.props.movie.releaseDate.slice(0, 4)})</div>
          <div className="rating">
            <Star className="star" size={20} /> <div className="text">  </div><div className="votes-amount">  </div>
          </div>
          <div className="details">
            <div><span className="category">Genre:</span> {this.props.movie.genre.join(", ")}</div>
            <div><span className="category">Length: </span> {parseInt(this.props.movie.length / 60)}h {(this.props.movie.length % 60 !== 0) ? this.props.movie.length % 60 + "min" : null}</div>
            <div><span className="category">Director:</span>  </div>
          </div>
        </div>
      </div>
    );
  }
}

