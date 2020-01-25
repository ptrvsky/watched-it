import React from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { Search } from 'react-feather';
import './SearchBar.scss';

export default class SearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      results: [],
      posters: [],
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputLostFocus = this.handleInputLostFocus.bind(this);
  }

  handleInputChange(event) {
    this.setState({
      results: [],
      posters: [],
    });
    
    if (event.target.value) {
      fetch('/api/productions?limit=3&search=' + event.target.value)
        .then(response => response.json())
        .then(response => response.rows.map(production => fetch('/api/images/' + production.id)
          .then(poster => poster.json())
          .then(poster => {
            this.setState({
              results: this.state.results.concat(production),
              posters: this.state.posters.concat(poster.url)
            })
          })));
    }
  }

  handleInputLostFocus(event) {
    event.target.value = null;
    // Delays state change so links in search results don't disapper right before clicking on them
    setTimeout(() => this.setState({
      results: [],
      posters: [],
    }), 100);
  }

  render() {
    return (
      <div className={this.props.isMobile ? "search-bar" : "search-bar search-bar--desktop"} >
        <Form inline >
          <input className="search-input" type="text" placeholder="Search" onInput={this.handleInputChange} onBlur={this.handleInputLostFocus} />
          <button className="btn"><Search /></button>
        </Form>
        {this.state.results.length !== 0 ? <div className="search-results-wrapper">
          {this.state.results.map((production, index) =>
            <Link to={'/movies/' + production.id} key={production.id} >
              <div className="search-result">
                {this.state.posters[index] ? <img src={"/api/" + this.state.posters[index]} alt="poster" /> : null} {production.title}
              </div>
            </Link>
          )}
        </div> : null}
      </div>
    );
  }
}