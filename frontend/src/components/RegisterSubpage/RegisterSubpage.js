import React from 'react';
import '../../assets/styles/buttons.scss';
import './RegisterSubpage.scss';

export default class RegisterSubpage extends React.Component {

  render() {
    return (
      <div className="register-subpage-wrapper">
        <h1>Register</h1>
        <div className="title-underline" />
        <form action="/api/users/register" method="POST">
          <div className="form-element">
            <label>Name</label>
            <input type="name" placeholder="Enter your name" />
          </div>
          <div className="form-element">
            <label>E-mail</label>
            <input type="email" placeholder="Enter your e-mail adress" />
          </div>
          <div className="form-element">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" />
          </div>
          <div className="form-element">
            <label>Confirm password</label>
            <input type="password" placeholder="Enter your password again" />
          </div>
          <button type="submit" className="btn-primary">Register</button>
        </form>
      </div>
    );
  }
}
