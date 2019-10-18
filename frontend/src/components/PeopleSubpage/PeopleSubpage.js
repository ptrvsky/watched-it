import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/buttons.scss';
import './PeopleSubpage.scss';
import PersonDetailsMedium from './PersonDetailsMedium/PersonDetailsMedium';

export default class PeopleSubpage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      people: [],
      peopleCount: null,
      order: null,
      page: 0
    }
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  fetchPeople() {
    fetch('/api/people?limit=10&offset=' + this.state.page * 10)
      .then(response => response.json())
      .then(people => {
        if (Array.isArray(people.rows)) {
          this.setState({
            people: people.rows,
            peopleCount: people.count
          })
        }
      })
      .catch(err => console.log(err));
  }

  handlePageChange(event) {
    if (event.target.id === "next" && this.state.page * 10 + 10 < this.state.peopleCount) {
      this.setState({ 
        peopleCount: null, // Delays loading of peopleCount so pagination buttons don't hide/show before people load
        page: this.state.page + 1 
      })
    }

    if (event.target.id === "previous" && this.state.page > 0) {
      this.setState({ 
        peopleCount: null, // Delays loading of peopleCount so pagination buttons don't hide/show before people load
        page: this.state.page - 1 
      })
    }
  }

  componentDidMount() {
    this.fetchPeople();
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevState) !== JSON.stringify(this.state)) {
      this.fetchPeople();
    }
  }

  render() {
    return (
      <div className="people-subpage-wrapper">
        <h1>People</h1>
        <div className="title-underline" />
        <div className="content-wrapper">
          <div className="list-wrapper">
            {this.state.people.map((person) => <Link to={"/people/" + person.id} key={person.id} ><PersonDetailsMedium person={person} /></Link>)}
            <div className="page-buttons-wrapper">
              {this.state.page > 0 && this.state.peopleCount ? <button className="btn-primary page-button" id="previous" onClick={this.handlePageChange} >Previous page</button> : null}
              {this.state.page * 10 + 10 < this.state.peopleCount && this.state.peopleCount ? <button className="btn-primary page-button page-button--next" id="next" onClick={this.handlePageChange} >Next page</button> : null}
            </div>
          </div>
          <div className="filter-wrapper">
            <div className="filter-title">Filters<div className="wip-label">Work in progress</div></div>
            <div className="filter-category-wrapper">
              <h3>Sort by</h3>
              <div className={this.state.order === "mostPopular" ? "btn-filter btn-filter--checked" : "btn-filter"} id="mostPopular">Most popular</div>
              <div className={this.state.order === "topRated" ? "btn-filter btn-filter--checked" : "btn-filter"} id="topRated">Top rated</div>
              <div className={this.state.order === "recentlyFeatured" ? "btn-filter btn-filter--checked" : "btn-filter"} id="recentlyFeatured">Recently featured</div>
            </div>
            <div className="filter-category-wrapper">
              <h3>Rating</h3>
              <label className="btn-filter btn-filter--checked">9+</label>
              <label className="btn-filter">9-8</label>
              <label className="btn-filter">8-7</label>
              <label className="btn-filter">7-6</label>
              <label className="btn-filter">6-5</label>
              <label className="btn-filter">5-0</label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
