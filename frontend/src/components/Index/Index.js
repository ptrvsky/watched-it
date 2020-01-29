import React from 'react';
import { Link } from "react-router-dom";
import '../../assets/styles/buttons.scss';
import './Index.scss';

export default class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {
        status: 'NOT_LOGGED',
      },
    }
  }

  componentDidMount() {
    fetch('/api/users/auth')
      .then((user) => user.json())
      .then((user) => this.setState({ user }));
  }

  render() {
    return (
      <div className="index-wrapper">
        <div className="p1">Complete TV watching assistant.</div>
        <div className="p2">Track, rate, discover.</div>
        {this.state.user.status === 'LOGGED' ?
          <Link to="/movies">
            <button className="btn-primary">Browse</button>
          </Link>
          :
          <Link to="/register">
            <button className="btn-primary">Sign up</button>
          </Link>
        }
      </div>
    );
  }
}