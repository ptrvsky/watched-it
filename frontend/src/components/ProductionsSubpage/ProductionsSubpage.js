import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import '../../assets/styles/buttons.scss';
import '../../assets/styles/labels.scss';
import './ProductionsSubpage.scss';
import ProductionDetailsMedium from './ProductionDetailsMedium/ProductionDetailsMedium';

export default class ProductionsSubpage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      productions: [],
      productionsCount: null,
      order: null,
      lengthMin: 0,
      lengthMax: 999999,
      lengthFilters: {
        length0to90: false,
        length90to120: false,
        length120to180: false,
        lengthOver180: false,
      },
      user: {
        status: 'NOT_LOGGED'
      },
      platforms: [false, false, false],
      page: 0,
      redirect: false,
    }

    if (this.props.platform === "Netflix") this.state.platforms = [true, false, false];
    if (this.props.platform === "HBO GO") this.state.platforms = [false, true, false];
    if (this.props.platform === "Prime Video") this.state.platforms = [false, false, true];

    this.handleOrderChange = this.handleOrderChange.bind(this);
    this.handlePlatformChange = this.handlePlatformChange.bind(this);
    this.handleLengthFilterChange = this.handleLengthFilterChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleRemovingProductionFromWatchlist = this.handleRemovingProductionFromWatchlist.bind(this);
  }

  async fetchProductions() {
    let url = '/api/productions?order=' + this.state.order +
      (this.props.isSerie !== undefined ? ('&isSerie= ' + this.props.isSerie) : '') +
      '&lengthMin=' + this.state.lengthMin +
      '&lengthMax=' + this.state.lengthMax +
      '&limit=10&offset=' + this.state.page * 10;

    this.state.platforms.map((platform, index) => platform ? url += "&platformId=" + (index + 1) : null);

    if (this.state.user.status === 'LOGGED') {
      if (this.props.type === 'watchlist') {
        await fetch('/api/users/' + this.state.user.id + '/watchlist')
          .then(response => response.json())
          .then(usersProductions => usersProductions.map(userProduction => userProduction.productionId))
          .then(productionsIds => url += "&ids=" + productionsIds.join(","));
      } else if (this.props.type === 'ratings') {
        await fetch('/api/users/' + this.state.user.id + '/productions-rates')
          .then(response => response.json())
          .then(usersProductions => usersProductions.map(userProduction => userProduction.productionId))
          .then(productionsIds => url += "&ids=" + productionsIds.join(","));
      }
    }

    fetch(url)
      .then(response => response.json())
      .then(productions => {
        if (Array.isArray(productions.rows)) {
          this.setState({
            productions: productions.rows,
            productionsCount: productions.count
          })
        }
      })
      .catch(err => console.log(err));
  }

  handleOrderChange(event) {
    this.setState({ order: event.target.id });
  }

  handlePlatformChange(event) {
    let platforms = [...this.state.platforms];
    platforms[event.currentTarget.id - 1] = !platforms[event.currentTarget.id - 1];
    this.setState({ platforms });
  }

  handlePageChange(event) {
    if (event.target.id === "next" && this.state.page * 10 + 10 < this.state.productionsCount) {
      this.setState({
        productionsCount: null, // Delays loading of productionsCount so pagination buttons don't hide/show before productions load
        page: this.state.page + 1
      })
    }

    if (event.target.id === "previous" && this.state.page > 0) {
      this.setState({
        productionsCount: null, // Delays loading of productionsCount so pagination buttons don't hide/show before productions load
        page: this.state.page - 1
      })
    }
  }

  handleLengthFilterChange(event) {
    let lengthMin = 0;
    let lengthMax = 999999;
    let lengthFilters = this.state.lengthFilters;

    lengthFilters[event.target.id] = !lengthFilters[event.target.id];

    if (lengthFilters.lengthOver180) lengthMin = 180;
    if (lengthFilters.length120to180) lengthMin = 120;
    if (lengthFilters.length90to120) lengthMin = 90;
    if (lengthFilters.length0to90) lengthMin = 0;
    if (lengthFilters.length0to90) lengthMax = 0;
    if (lengthFilters.length90to120) lengthMax = 120;
    if (lengthFilters.length120to180) lengthMax = 180;
    if (lengthFilters.lengthOver180) lengthMax = 999999;

    this.setState({
      lengthMin,
      lengthMax,
      lengthFilters
    });
  }

  handleRemovingProductionFromWatchlist() {
    if (this.props.type === 'watchlist') this.fetchProductions();
  }

  componentDidMount() {
    fetch('/api/users/auth')
      .then((user) => user.json())
      .then((user) => {
        this.setState({ user });
        return user;
      })
      .then((user) => {
        if (this.props.type && user.status === 'NOT_LOGGED') {
          this.setState({ redirect: true });
        } else {
          this.fetchProductions();
        }
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevState) !== JSON.stringify(this.state)) {
      fetch('/api/users/auth')
        .then((user) => user.json())
        .then((user) => {
          this.setState({ user });
          return user;
        })
        .then((user) => {
          if (this.props.type && user.status === 'NOT_LOGGED') {
            this.setState({ redirect: true });
          } else {
            this.fetchProductions();
          }
        });
    }
  }

  render() {
    const title = this.props.type === 'watchlist' ? "Your watchlist" :
      this.props.type === 'ratings' ? "Your ratings" :
        this.props.platform ? this.props.platform :
          this.props.isSerie ? "TV Series" :
            "Movies";

    if (this.state.redirect) return <Redirect to='/login?unauthenticatedAccessTry=true' />;

    return (
      <div className="productions-subpage-wrapper">
        <h1>{title}</h1>
        <div className="title-underline" />
        <div className="content-wrapper">
          <div className="list-wrapper">
            {this.state.productions.map((production) => <Link to={(this.props.isSerie ? "/tvseries/" : "/movies/") + production.id} key={production.id} >
              <ProductionDetailsMedium production={production} user={this.state.user} handleRemovingProductionFromWatchlist={this.handleRemovingProductionFromWatchlist} />
            </Link>)}
            <div className="page-buttons-wrapper">
              {this.state.page > 0 && this.state.productionsCount ? <button className="btn-primary page-button" id="previous" onClick={this.handlePageChange} >Previous page</button> : null}
              {this.state.page * 10 + 10 < this.state.productionsCount && this.state.productionsCount ? <button className="btn-primary page-button page-button--next" id="next" onClick={this.handlePageChange} >Next page</button> : null}
            </div>
          </div>
          <div className="filter-wrapper">
            <div className="filter-title">Filters<div className="wip-label">Work in progress</div></div>
            <div className="filter-category-wrapper">
              <h3>Sort by</h3>
              <div className={this.state.order === "mostPopular" ? "btn-filter btn-filter--checked" : "btn-filter"} id="mostPopular" onClick={this.handleOrderChange}>Most popular</div>
              <div className={this.state.order === "topRated" ? "btn-filter btn-filter--checked" : "btn-filter"} id="topRated" onClick={this.handleOrderChange}>Top rated</div>
              <div className={this.state.order === "recentlyFeatured" ? "btn-filter btn-filter--checked" : "btn-filter"} id="recentlyFeatured" onClick={this.handleOrderChange}>Recently featured</div>
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
            {this.props.platform ? null :
              <div className="filter-category-wrapper">
                <h3>Platforms</h3>
                <label className={this.state.platforms[0] ? "platform platform--checked" : "platform"} id="1"
                  onClick={this.handlePlatformChange}>
                  <img src={"/images/platforms/platform1.png"} alt="netflix" />
                </label>
                <label className={this.state.platforms[1] ? "platform platform--checked" : "platform"} id="2"
                  onClick={this.handlePlatformChange}>
                  <img src={"/images/platforms/platform2.png"} alt="hbogo" />
                </label>
                <label className={this.state.platforms[2] ? "platform platform--checked" : "platform"} id="3"
                  onClick={this.handlePlatformChange}>
                  <img src={"/images/platforms/platform3.png"} alt="primevideo" />
                </label>
              </div>
            }
            <div className="filter-category-wrapper">
              <h3>Genres</h3>
              <label className="btn-filter">Action</label>
              <label className="btn-filter">Adventure</label>
              <label className="btn-filter">Animation</label>
              <label className="btn-filter">Biography</label>
              <label className="btn-filter">Comedy</label>
              <label className="btn-filter">Crime</label>
              <label className="btn-filter">Drama</label>
              <label className="btn-filter">Family</label>
              <label className="btn-filter">Fantasy</label>
              <label className="btn-filter">History</label>
              <label className="btn-filter">Horror</label>
              <label className="btn-filter">Musical</label>
              <label className="btn-filter">Mystery</label>
              <label className="btn-filter">Romance</label>
              <label className="btn-filter">Sci-Fi</label>
              <label className="btn-filter">Sport</label>
              <label className="btn-filter">Thriller</label>
              <label className="btn-filter">War</label>
              <label className="btn-filter">Western</label>
            </div>
            <div className="filter-category-wrapper">
              <h3>Length</h3>
              <div className={this.state.lengthFilters.length0to90 ? "btn-filter btn-filter--checked" : "btn-filter"} id="length0to90" onClick={this.handleLengthFilterChange} >0-90 min</div>
              <div className={this.state.lengthFilters.length90to120 ? "btn-filter btn-filter--checked" : "btn-filter"} id="length90to120" onClick={this.handleLengthFilterChange} >90-120 min</div>
              <div className={this.state.lengthFilters.length120to180 ? "btn-filter btn-filter--checked" : "btn-filter"} id="length120to180" onClick={this.handleLengthFilterChange} >120-180 min</div>
              <div className={this.state.lengthFilters.lengthOver180 ? "btn-filter btn-filter--checked" : "btn-filter"} id="lengthOver180" onClick={this.handleLengthFilterChange} >180+ min</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
