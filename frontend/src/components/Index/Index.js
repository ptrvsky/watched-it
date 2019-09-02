import React from 'react';
import { BrowserRouter as Link } from "react-router-dom";
import '../../assets/styles/buttons.scss';
import './Index.scss';

function Index() {
  return (
    <div className="index-wrapper">
      <div className="p1">Complete TV watching assistant.</div>
      <div className="p2">Track, rate, discover.</div>
      <button className="btn-primary">
        <Link to="/">Sign up</Link>
      </button>
    </div>
  );
}

export default Index;