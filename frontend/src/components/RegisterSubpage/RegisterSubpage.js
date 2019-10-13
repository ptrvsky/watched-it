import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/buttons.scss';
import './RegisterSubpage.scss';

export default class RegisterSubpage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      errors: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    fetch('/api/users/auth')
      .then((user) => user.json())
      .then((user) => {
        if (user.status === 'LOGGED') this.props.history.push('/')
      });
  }

  handleSubmit(event) {
    event.preventDefault(); // Prevent browser reload/refresh
    this.setState({ errors: [] });

    fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: event.target[0].value,
        email: event.target[1].value,
        password: event.target[2].value,
        password2: event.target[3].value,
      })
    })
      .then(res => {
        if (res.status === 201) {
          this.props.history.push('/login?registrationRedirect=true');  // Redirect to login page after succesful user registration
        } else {
          res.json().then(res => res.map(error => this.setState({ errors: this.state.errors.concat(error.msg) })));
        }
      });
  }

  render() {
    return (
      <div className="register-subpage-wrapper">
        <h1>Register</h1>
        <div className="title-underline" />
        {this.state.errors.map(error => <div className="error" key={error}> {error} </div>)}
        <form onSubmit={this.handleSubmit} >
          <div className="form-element">
            <label>Name</label>
            <input type="name" name="name" placeholder="Enter your name" />
          </div>
          <div className="form-element">
            <label>E-mail</label>
            <input type="email" name="email" placeholder="Enter your e-mail adress" autoComplete="new-password" />
          </div>
          <div className="form-element">
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter your password" autoComplete="new-password" />
          </div>
          <div className="form-element">
            <label>Confirm password</label>
            <input type="password" name="password2" placeholder="Enter your password again" />
          </div>
          <button type="submit" className="btn-primary">Register</button>
        </form>
        <div className="account-question">Have an account? <Link to="/login">Log in</Link>.</div>
      </div>
    );
  }
}
