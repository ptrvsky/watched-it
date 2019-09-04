import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Form, NavDropdown } from 'react-bootstrap';
import { Search, User } from 'react-feather';
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

function NavigationBar() {

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
            <NavDropdown alignRight title={<User />} className="user-button-mobile ml-auto">
              <Link to="/watchlist" className="dropdown-item">Watchlist</Link>
              <Link to="/ratings" className="dropdown-item">Ratings</Link>
              <Link to="/settings" className="dropdown-item">Settings</Link>
              <NavDropdown.Divider />
              <Link to="/logout" className="dropdown-item">Logout</Link>
            </NavDropdown>
            <Navbar.Toggle />
            <Navbar.Collapse className="links">
              <Nav.Link><Link to="/movies">Movies</Link></Nav.Link>
              <Nav.Link><Link to="/tvseries">TV Series</Link></Nav.Link>
              <Nav.Link><Link to="/people">People</Link></Nav.Link>
              <Nav.Link><Link to="/rankings">Rankings</Link></Nav.Link>
            </Navbar.Collapse>
            <div className="search-bar" >
              <Form inline >
                <input className="search-input" type="text" placeholder="Search" />
                <button className="btn"><Search /></button>
              </Form>
            </div>
          </Mobile>

          <Desktop>
            <Nav.Link><Link to="/movies">Movies</Link></Nav.Link>
            <Nav.Link><Link to="/tvseries">TV Series</Link></Nav.Link>
            <Nav.Link><Link to="/people">People</Link></Nav.Link>
            <Nav.Link><Link to="/rankings">Rankings</Link></Nav.Link>
            <div className="search-bar search-bar--desktop" >
              <Form inline >
                <input className="search-input" type="text" placeholder="Search" />
                <button className="btn"><Search /></button>
              </Form>
            </div>
            <NavDropdown alignRight title={<User />} className="ml-auto">
              <Link to="/watchlist" className="dropdown-item">Watchlist</Link>
              <Link to="/ratings" className="dropdown-item">Ratings</Link>
              <Link to="/settings" className="dropdown-item">Settings</Link>
              <NavDropdown.Divider />
              <Link to="/logout" className="dropdown-item">Logout</Link>
            </NavDropdown>
          </Desktop>

        </Navbar>
        <div className="navbar-underline" />
      </div>
    </div>
  );
}

export default NavigationBar;
