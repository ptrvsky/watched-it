import React from 'react';
import './PersonDetailsMedium.scss';
import { Star } from 'react-feather';
import { withRouter } from 'react-router';
import countPersonAge from '../../../utils/countPersonAge';

class PersonDetailsMedium extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      faceImage: null,
      averageRating: null,
      ratesQuantity: 0,
      professions: [],
    }
  }

  componentDidMount() {
    fetch('/api/images/' + this.props.person.faceImageId)
      .then(faceImage => faceImage.json())
      .then(faceImage => {
        this.setState({ faceImage: faceImage.url })
      });

    fetch('/api/people/' + this.props.person.id + '/professions')
      .then(professions => professions.json())
      .then(professions => {
        this.setState({ professions: professions })
      });

    fetch('/api/people/' + this.props.person.id + '/rates/stats')
      .then((ratingStats) => ratingStats.json())
      .then((ratingStats) => {
        if (ratingStats.quantity > 0) {
          this.setState({
            averageRating: Number(ratingStats.average).toFixed(2),
            ratesQuantity: ratingStats.quantity,
          });
        }
      });
  };

  render() {
    const age = this.props.person.dob ? countPersonAge(this.props.person.dob, this.props.person.dod) : null;

    return (
      <div className="person-details-medium-wrapper">
        <div className="faceImage">{this.state.faceImage ? <img src={"/api/" + this.state.faceImage} alt="faceImage" /> : null}</div>
        <div className="info">
          <div className="name">{this.props.person.name} </div>
          <div className="profession"> {this.state.professions.join(", ")}</div>
          <div className="rating-wrapper">
            <Star className="star" size={20} />
            <div className="average-rating"> {this.state.averageRating ? this.state.averageRating : null} </div>
            <div className="votes-amount">
              {this.state.ratesQuantity ?
                this.state.ratesQuantity === "1" ? "(" + this.state.ratesQuantity + " vote)" : "(" + this.state.ratesQuantity + " votes)" :
                "Not rated yet"}
            </div>
          </div>
          <div className="details">
            {age ?
              <div><span className="category">Age: </span>{this.props.person.dod ? <span> &#10013;</span> : null}
                {age}  <span className="dates">{" (" + (this.props.person.dob.slice(0, 4))}
                  {this.props.person.dod ? " - " + this.props.person.dod.slice(0, 4) : null})</span>
              </div> :
              null}
            <div><span className="category">Birthplace:</span> {this.props.person.birthplace}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(PersonDetailsMedium);
