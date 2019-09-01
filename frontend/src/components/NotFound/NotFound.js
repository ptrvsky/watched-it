import React from 'react';
import { BrowserRouter as Router, Link } from "react-router-dom";
import './NotFound.scss';


function NotFound() {
  return (
    <Router>
      <div className="not-found-wrapper">
        <p>Oops! Something went wrong!</p><br />
        <button className="not-found-button">
          <Link to="/">Go to homepage</Link>
        </button>
      </div>
    </Router>
  );
}

export default NotFound;