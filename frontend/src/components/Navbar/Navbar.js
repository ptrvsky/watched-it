import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Navbar, Form, NavDropdown } from 'react-bootstrap';
import { Search, User, LogIn } from 'react-feather';
import { useMediaQuery } from 'react-responsive'
import './Navbar.scss';

const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 992 })
  return isDesktop ? children : null
}

const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 991 })
  return isMobile ? children : null
}
class NavigationBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {
        status: 'NOT_LOGGED',
      },
    }
    this.authenticateUser = this.authenticateUser.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  authenticateUser() {
    fetch('/api/users/auth')
      .then((user) => user.json())
      .then((user) => this.setState({ user }));
  }

  handleLogout() {
    fetch('/api/users/logout')
      .then(() => {
        this.authenticateUser();
        this.props.history.push('/login?logout=true');
      });
  }

  componentDidMount() {
    this.authenticateUser();
  }

  render() {
    return (
      <div className="Navbar">
        <div className="navbar-container">
          <Navbar variant="dark" expand="lg">
            <Link to="/">
              <Navbar.Brand>
                <img
                  src="/logo192.png"
                  width="38"
                  height="38"
                  className="d-inline-block align-top"
                  alt="Watched It logo"
                />
                <div className="logo-text d-inline-block align-top"><span className="light-gray">watched</span><span className="orange">it</span></div>
              </Navbar.Brand>
            </Link>

            <Mobile>
            {this.state.user.status === 'LOGGED' ?
                <NavDropdown alignRight title={<User />} className="user-button-mobile ml-auto">
                  <Link to="/watchlist" className="dropdown-item">Watchlist</Link>
                  <Link to="/ratings" className="dropdown-item">Ratings</Link>
                  <Link to="/settings" className="dropdown-item">Settings</Link>
                  <NavDropdown.Divider />
                  <div className="dropdown-item" onClick={this.handleLogout}>Logout</div>
                </NavDropdown>
                : <Link to="/login" className="login-button-mobile ml-auto" >{<LogIn />}</Link>}
              <Navbar.Toggle />
              <Navbar.Collapse className="links">
                <Link to="/movies" className="nav-link">Movies</Link>
                <Link to="/tvseries" className="nav-link">TV Series</Link>
                <Link to="/people" className="nav-link">People</Link>
                <Link to="/rankings" className="nav-link">Rankings</Link>
              </Navbar.Collapse>
              <div className="search-bar" >
                <Form inline >
                  <input className="search-input" type="text" placeholder="Search" />
                  <button className="btn"><Search /></button>
                </Form>
              </div>
            </Mobile>

            <Desktop>
              <Link to="/movies" className="nav-link">Movies</Link>
              <Link to="/tvseries" className="nav-link">TV Series</Link>
              <Link to="/people" className="nav-link">People</Link>
              <Link to="/rankings" className="nav-link">Rankings</Link>
              <div className="search-bar search-bar--desktop" >
                <Form inline >
                  <input className="search-input" type="text" placeholder="Search" />
                  <button className="btn"><Search /></button>
                </Form>
              </div>
              {this.state.user.status === 'LOGGED' ?
                <NavDropdown alignRight title={<User />} className="ml-auto">
                  <Link to="/watchlist" className="dropdown-item">Watchlist</Link>
                  <Link to="/ratings" className="dropdown-item">Ratings</Link>
                  <Link to="/settings" className="dropdown-item">Settings</Link>
                  <NavDropdown.Divider />
                  <div className="dropdown-item" onClick={this.handleLogout}>Logout</div>
                </NavDropdown>
                : <Link to="/login">{<LogIn />}</Link>}
            </Desktop>

          </Navbar>
          <div className="navbar-underline" />
        </div>
      </div>
    );
  }
}

export default withRouter(NavigationBar);