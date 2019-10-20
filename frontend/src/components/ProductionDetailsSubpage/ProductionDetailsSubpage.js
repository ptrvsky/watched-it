import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/buttons.scss';
import './ProductionDetailsSubpage.scss';
import PersonMedium from './PersonMedium/PersonMedium';
import ProductionRating from './ProductionRating/ProductionRating';

export default class ProductionDetailsSubpage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      production: null,
      poster: null,
      people: [],
      images: [],
    }
  }

  fetchProduction() {
    fetch('/api/productions/' + this.props.match.params.id)
      .then(response => response.json())
      .then(production => {
        this.setState({ production });
        fetch('/api/images/' + production.posterId)
          .then(poster => poster.json())
          .then(poster => this.setState({ poster: poster.url }));

        fetch('/api/productions/' + production.id + '/people')
          .then(productionsPeople => productionsPeople.json())
          .then(productionsPeople => productionsPeople.map(productionPerson =>
            fetch('/api/people/' + productionPerson.personId)
              .then(person => person.json())
              .then(person => this.setState({
                people: this.state.people.concat({
                  id: person.id,
                  name: person.name,
                  faceImageId: person.faceImageId,
                  role: productionPerson.role,
                  description: productionPerson.description
                })
              }))
          ));

        fetch('/api/productions/' + production.id + '/images?limit=3')
          .then(images => images.json())
          .then(images => images.map(image =>
            this.setState({
              images: this.state.images.concat(image.url)
            })
          ));
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.fetchProduction();
  }

  render() {
    return (
      <div className="production-details-subpage-wrapper" >
        <div className="bg-image"></div>
        <div className="content-wrapper">
          <div className="title-wrapper">{this.state.production !== null ? this.state.production.title : null}</div>
          <div className="sub-content-wrapper">

            <div className="left-wrapper">
              <div className="details">
                <div className="poster">
                  {this.state.poster !== null ? <img src={"/api/" + this.state.poster} alt="poster" /> : null}
                </div>
                <div className="info">
                  <div>
                    <span className="category">Release date: </span>
                    {this.state.production !== null ? this.state.production.releaseDate : null}
                  </div>
                  <div>
                    <span className="category">Genre: </span>
                    {this.state.production !== null ? this.state.production.genre.join(", ") : null}
                  </div>
                  <div>
                    <span className="category">Length: </span>
                    {(this.state.production !== null && this.state.production.length >= 60) ? parseInt(this.state.production.length / 60) + "h " : null}
                    {(this.state.production !== null && this.state.production.length % 60 !== 0) ? this.state.production.length % 60 + "min" : null}
                  </div>
                  <div>
                    <span className="category">Director: </span>
                    {this.state.people
                      .filter((person) => person.role === 'Director')
                      .map((person) => person.name).join(", ")}
                  </div>
                </div>
              </div>
              <div className="production-description">{this.state.production !== null ? this.state.production.description : null}</div>
              <Link to={this.props.match.params.id + "/cast"}><h2>Cast</h2></Link>
              <div className="cast">
                {this.state.people !== null ? this.state.people
                  .filter((person) => person.role === 'Actor')
                  .map((person) => <Link to={'/people/' + person.id} key={person.id} ><PersonMedium person={person} /></Link>) : null}
              </div>

              <Link to={this.props.match.params.id + "/crew"}><h2>Crew</h2></Link>
              <div className="cast">
                {this.state.people !== null ? this.state.people
                  .filter((person) => person.role !== 'Actor')
                  .map((person) => <Link to={'/people/' + person.id} key={person.id} ><PersonMedium person={person} /></Link>) : null}
              </div>
            </div>

            <div className="right-wrapper">
              <ProductionRating productionId={this.props.match.params.id} />
              <Link to={this.props.match.params.id + "/images"}><h2>Images</h2></Link>
              <div className="images-wrapper">
                {this.state.images !== null ? this.state.images.map(image => <div className="image-thumbnail" key={image}><img src={"/api/" + image} alt={image} /></div>) : null}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}
