import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/buttons.scss';
import './LoginSubpage.scss';

export default class LoginSubpage extends React.Component {

  render() {
    return (
      <div className="login-subpage-wrapper">
        <h1>Log in</h1>
        <div className="title-underline" />
        {this.props.location.search === "?registrationRedirect=true" ? <div className="registration-success">Your account has been created. Now you can log in.</div> : null}
        <form action="/api/users/login" method="POST">
          <div className="form-element">
            <label>Name</label>
            <input type="name" placeholder="Enter your name" />
          </div>
          <div className="form-element">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" />
          </div>
          <button type="submit" className="btn-primary">Log in</button>
        </form>
        <div className="account-question">New to Watched It? <Link to="/register">Sign up</Link>.</div>
      </div>
    );
  }
}
