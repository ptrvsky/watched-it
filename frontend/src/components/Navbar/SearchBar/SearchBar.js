import React from 'react';
import { Form } from 'react-bootstrap';
import { Search } from 'react-feather';
import './SearchBar.scss';

export default class SearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      result: null,
    }
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    if (event.target.value) {
      fetch('/api/productions?limit=3&search=' + event.target.value)
        .then(response => response.json())
        .then(response => this.setState({
          result: response.rows,
        }));
    } else {
      this.setState({
        result: null,
      })
    }
  }

  render() {
    return (
      <div className={this.props.isMobile ? "search-bar" : "search-bar search-bar--desktop"} >
        <Form inline >
          <input className="search-input" type="text" placeholder="Search" onInput={this.handleInputChange} />
          <button className="btn"><Search /></button>
        </Form>
        <div className="search-results"></div>
      </div>
    );
  }
}