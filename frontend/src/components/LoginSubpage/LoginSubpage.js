import React from 'react';
import '../../assets/styles/buttons.scss';
import './LoginSubpage.scss';

export default class LoginSubpage extends React.Component {

  render() {
    return (
      <div className="login-subpage-wrapper">
        <h1>Log in</h1>
        <div className="title-underline" />
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
      </div>
    );
  }
}
