import React from 'react';
import { Form } from 'react-bootstrap';
import { Search } from 'react-feather';
import './SearchBar.scss';

export default class SearchBar extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.isMobile ? "search-bar" : "search-bar search-bar--desktop"} >
        <Form inline >
          <input className="search-input" type="text" placeholder="Search" />
          <button className="btn"><Search /></button>
        </Form>
        <div className="search-results"></div>
      </div>
    );
  }
}