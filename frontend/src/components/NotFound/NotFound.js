import React from 'react';
import { Link } from "react-router-dom";
import '../../assets/styles/buttons.scss';
import './NotFound.scss';

function NotFound() {
  return (
      <div className="not-found-wrapper">
        <p>Oops! Something went wrong!</p><br />
        <button className="btn-primary">
          <Link to="/">Go to homepage</Link>
        </button>
      </div>
  );
}

export default NotFound;