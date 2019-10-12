import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/buttons.scss';
import './LoginSubpage.scss';

export default class LoginSubpage extends React.Component {

  componentDidMount() {
    fetch('/api/users/auth')
      .then((user) => user.json())
      .then((user) => {
        if (user.status === 'LOGGED') this.props.history.push('/')
      });
  }

  render() {
    return (
      <div className="login-subpage-wrapper">
        <h1>Log in</h1>
        <div className="title-underline" />
        {this.props.location.search === "?registrationRedirect=true" ? <div className="success">Your account has been created. Now you can log in.</div> : null}
        {this.props.location.search === "?logout=true" ? <div className="success">You are logged out.</div> : null}
        {this.props.location.search === "?failure=true" ? <div className="error">Incorrect e-mail or password. Try again.</div> : null}
        {this.props.location.search === "?unauthenticatedRateTry=true" ? <div className="error">You have to be logged in to rate production.</div> : null}
        {this.props.location.search === "?unauthenticatedAddToWatchlistTry=true" ? <div className="error">You have to be logged in to add production to your watchlist.</div> : null}
        <form action="/api/users/login" method="POST">
          <div className="form-element">
            <label>E-mail</label>
            <input type="email" name="email" placeholder="Enter your e-mail" />
          </div>
          <div className="form-element">
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter your password" />
          </div>
          <button type="submit" className="btn-primary">Log in</button>
        </form>
        <div className="account-question">New to Watched It? <Link to="/register">Sign up</Link>.</div>
      </div>
    );
  }
}
