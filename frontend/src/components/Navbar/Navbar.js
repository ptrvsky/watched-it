import React from 'react';
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
          <Navbar.Brand href="/">
            <img
              src="/logo192.png"
              width="38"
              height="38"
              className="d-inline-block align-top"
              alt="Watched It logo"
            />
            <div className="logo-text d-inline-block align-top"><span className="light-gray">watched</span><span className="orange">it</span></div>
          </Navbar.Brand>

          <Mobile>
            <NavDropdown alignRight title={<User />} className="user-button-mobile ml-auto">
              <NavDropdown.Item href="/watchlist">Watchlist</NavDropdown.Item>
              <NavDropdown.Item href="/ratings">Ratings</NavDropdown.Item>
              <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/logout">Log out</NavDropdown.Item>
            </NavDropdown>
            <Navbar.Toggle />
            <Navbar.Collapse className="links">
              <Nav.Link href="/productions">Movies</Nav.Link>
              <Nav.Link href="/tvseries">TV Series</Nav.Link>
              <Nav.Link href="/people">People</Nav.Link>
              <Nav.Link href="/rankings">Rankings</Nav.Link>
            </Navbar.Collapse>
            <div className="search-bar" >
              <Form inline >
                <input className="search-input" type="text" placeholder="Search" />
                <button className="btn"><Search /></button>
              </Form>
            </div>
          </Mobile>

          <Desktop>
              <Nav.Link href="/productions">Movies</Nav.Link>
              <Nav.Link href="/tvseries">TV Series</Nav.Link>
              <Nav.Link href="/people">People</Nav.Link>
              <Nav.Link href="/rankings">Rankings</Nav.Link>
            <div className="search-bar search-bar--desktop" >
              <Form inline >
                <input className="search-input" type="text" placeholder="Search" />
                <button className="btn"><Search /></button>
              </Form>
            </div>
            <NavDropdown alignRight title={<User />} className="ml-auto">
              <NavDropdown.Item href="/watchlist">Watchlist</NavDropdown.Item>
              <NavDropdown.Item href="/ratings">Ratings</NavDropdown.Item>
              <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/logout">Log out</NavDropdown.Item>
            </NavDropdown>
          </Desktop>

        </Navbar>
      </div>
      <div className="navbar-underline"></div>
    </div>
  );
}

export default NavigationBar;
