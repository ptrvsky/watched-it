import React from 'react';
import { Link } from "react-router-dom";
import '../../assets/styles/buttons.scss';
import './MoviesSubpage.scss';
import MovieDetailsMedium from './MovieDetailsMedium/MovieDetailsMedium';

export default class MoviesSubpage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      movies: [],
    }
  }

  componentDidMount() {
    // TO-DO: Filter out TV Series
    fetch('/api/productions')
      .then(response => response.json())
      .then(movies => this.setState({ movies }))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="movies-subpage-wrapper">
        <h1>Movies</h1>
        <div className="title-underline" />
        <div className="content-wrapper">
          <div className="list-wrapper">
            {this.state.movies.map((movie) => <MovieDetailsMedium movie={movie} />)}
          </div>
          <div className="filter-wrapper">
            <h2>Filters</h2>
            <div className="filter-category-wrapper">
              <h3>Sort by</h3>
              <label className="btn-filter btn-filter--checked">Most popular</label>
              <label className="btn-filter">Top rated</label>
              <label className="btn-filter">Recently featured</label>
            </div>
            <div className="filter-category-wrapper">
              <h3>Rating</h3>
              <label className="btn-filter btn-filter--checked">9+</label>
              <label className="btn-filter">9-8</label>
              <label className="btn-filter">8-7</label>
              <label className="btn-filter">7-6</label>
              <label className="btn-filter">6-5</label>
              <label className="btn-filter">5-0</label>
            </div>
            <div className="filter-category-wrapper">
              <h3>Platforms</h3>
              <label className="btn-filter btn-filter--checked">Netflix</label>
              <label className="btn-filter">HBO GO</label>
              <label className="btn-filter">Prime Video</label>
            </div>
            <div className="filter-category-wrapper">
              <h3>Genres</h3>
              <label className="btn-filter">Action</label>
              <label className="btn-filter">Adventure</label>
              <label className="btn-filter">Animation</label>
              <label className="btn-filter">Biography</label>
              <label className="btn-filter">Comedy</label>
              <label className="btn-filter">Crime</label>
              <label className="btn-filter">Drama</label>
              <label className="btn-filter">Family</label>
              <label className="btn-filter">Fantasy</label>
              <label className="btn-filter">History</label>
              <label className="btn-filter">Horror</label>
              <label className="btn-filter">Musical</label>
              <label className="btn-filter">Mystery</label>
              <label className="btn-filter">Romance</label>
              <label className="btn-filter">Sci-Fi</label>
              <label className="btn-filter">Sport</label>
              <label className="btn-filter">Thriller</label>
              <label className="btn-filter">War</label>
              <label className="btn-filter">Western</label>
            </div>
            <div className="filter-category-wrapper">
              <h3>Length</h3>
              <label className="btn-filter">0-90 min</label>
              <label className="btn-filter">90-120 min</label>
              <label className="btn-filter">120-180 min</label>
              <label className="btn-filter">180+ min</label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
