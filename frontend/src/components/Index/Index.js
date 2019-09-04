import React from 'react';
import { Link } from "react-router-dom";
import '../../assets/styles/buttons.scss';
import './Index.scss';

function Index() {
  return (
    <div className="index-wrapper">
      <div className="p1">Complete TV watching assistant.</div>
      <div className="p2">Track, rate, discover.</div>
      <Link to="/login">
        <button className="btn-primary">Sign up</button>
      </Link>
    </div>
  );
}

export default Index;