import React from 'react';
import { Form } from 'react-bootstrap';
import { Search } from 'react-feather';
import './SearchBar.scss';

export default class SearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      result: null,
      posters: [],
    }
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    if (event.target.value) {
      fetch('/api/productions?limit=3&search=' + event.target.value)
        .then(response => response.json())
        .then(response => {
          this.setState({
            result: response.rows,
          });
          // Fetch posters of all 3 productions
          response.rows.map(production => fetch('/api/images/' + production.id)
            .then(poster => poster.json())
            .then(poster => {
              this.setState({ posters: this.state.posters.concat(poster.url) })
            }));
        });
    } else {
      this.setState({
        result: null,
        posters: [],
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
        {this.state.result ? <div className="search-results"></div> : null}
      </div>
    );
  }
}