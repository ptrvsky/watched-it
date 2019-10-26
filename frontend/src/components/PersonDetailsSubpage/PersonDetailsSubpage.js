import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/buttons.scss';
import './PersonDetailsSubpage.scss';
import RatingBox from '../RatingBox/RatingBox';
import countPersonAge from '../../utils/countPersonAge';

export default class PersonDetailsSubpage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      person: null,
      faceImage: null,
      professions: [],
      productions: [],
      images: [],
    }
  }

  fetchPerson() {
    // Fetch person data
    fetch('/api/people/' + this.props.match.params.id)
      .then(response => response.json())
      .then(person => {
        this.setState({ person });
        fetch('/api/images/' + person.faceImageId)
          .then(faceImage => faceImage.json())
          .then(faceImage => this.setState({ faceImage: faceImage.url }));
      });

    // Fetch person professions
    fetch('/api/people/' + this.props.match.params.id + '/professions')
      .then(professions => professions.json())
      .then(professions => {
        this.setState({ professions: professions })
      });

    // Fetch person's production-person assignments
    fetch('/api/people/' + this.props.match.params.id + '/productions')
      .then(productionsPeople => productionsPeople.json())
      .then(productionsPeople => productionsPeople.map(productionPerson =>
        fetch('/api/productions/' + productionPerson.productionId)
          .then(production => production.json())
          .then(production => this.setState({
            productions: this.state.productions.concat({
              id: production.id,
              title: production.title,
              posterId: production.posterId,
              releaseDate: production.releaseDate,
              role: productionPerson.role,
              description: productionPerson.description
            })
          }))
      ));

    // Fetch person's images
    fetch('/api/people/' + this.props.match.params.id + '/images?limit=3')
      .then(images => images.json())
      .then(images => images.map(image =>
        this.setState({
          images: this.state.images.concat(image.url)
        })
      ));
  }

  componentDidMount() {
    this.fetchPerson();
  }

  render() {
    const age = this.state.person ? countPersonAge(this.state.person.dob, this.state.person.dod) : null;

    return (
      <div className="person-details-subpage-wrapper">
        <div className="bg-image"></div>
        <div className="content-wrapper">
          <div className="name-wrapper">{this.state.person !== null ? this.state.person.name : null}</div>
          <div className="sub-content-wrapper">

            <div className="left-wrapper">
              <div className="details">
                <div className="faceImage">
                  {this.state.faceImage ? <img src={"/api/" + this.state.faceImage} alt="faceImage" /> : null}
                </div>
                {this.state.person ?
                  <div className="info">
                    <div>
                      <span className="category">Works as: </span>
                      {this.state.professions.join(", ")}
                    </div>
                    <div>
                      <span className="category">Age: </span>
                      {this.state.person.dod ? <span> &#10013;</span> : null}
                      {age}  <span className="dates">{" (" + this.state.person.dob}
                        {this.state.person.dod ? " - " + this.state.person.dod : null})</span>
                    </div>
                    <div>
                      <span className="category">Birthplace: </span>
                      {this.state.person ? this.state.person.birthplace : null}
                    </div>
                  </div>
                  : null}
              </div>
              <div className="person-biography">
                {this.state.person !== null ? this.state.person.biography : null}
              </div>
            </div>

            <div className="right-wrapper">
              <RatingBox rateType='person' id={this.props.match.params.id} />
              <Link to={this.props.match.params.id + "/images"}><h2>Images</h2></Link>
              <div className="images-wrapper">
                {this.state.images !== null ?
                  this.state.images.map(image =>
                    <div className="image-thumbnail" key={image}><img src={"/api/" + image} alt={image} /></div>)
                  : null}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}
