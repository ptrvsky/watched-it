import React from 'react';
import './MoviesSubpage.scss';

function MoviesSubpage() {

  return (
    <div className="movies-subpage-wrapper">
      <h1>Movies</h1>
      <div className="title-underline" />
      <div className="content-wrapper">
        <div className="list-wrapper">
        </div>
        <div className="filter-wrapper">
          <h2>Filters</h2>
          <div className="rating-wrapper">
            <h3>Rating</h3>
          </div>
          <div className="platforms-wrapper">
            <h3>Platforms</h3>
          </div>
          <div className="genre-wrapper">
            <h3>Genres</h3>
          </div>
          <div className="length-wrapper">
            <h3>Length</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoviesSubpage;