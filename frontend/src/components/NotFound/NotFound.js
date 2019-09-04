import React from 'react';
import { Link } from "react-router-dom";
import '../../assets/styles/buttons.scss';
import './NotFound.scss';

function NotFound() {
  return (
    <div className="not-found-wrapper">
      <p>Oops! Something went wrong!</p><br />
      <Link to="/">
        <button className="btn-primary">Go to homepage</button>
      </Link>
    </div>
  );
}

export default NotFound;