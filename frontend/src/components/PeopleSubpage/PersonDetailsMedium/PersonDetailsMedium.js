import React from 'react';
import './PersonDetailsMedium.scss';
import { Star } from 'react-feather';
import { withRouter } from 'react-router';

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
  };

  // Function that gets age from date of birth and date of death (or today's date if DOD isn't set)
  getAge(dob, dod) {
    const birthday = new Date(dob);
    const lastDay = dod ? new Date(dod) : new Date();
    let thisYear = 0;
    if (lastDay.getMonth() < birthday.getMonth()) {
      thisYear = 1;
    } else if ((lastDay.getMonth() === birthday.getMonth()) && lastDay.getDate() < birthday.getDate()) {
      thisYear = 1;
    }
    return lastDay.getFullYear() - birthday.getFullYear() - thisYear;
  }

  render() {
    const age = this.props.person.dob ? this.getAge(this.props.person.dob, this.props.person.dod) : null;

    return (
      <div className="person-details-medium-wrapper">
        <div className="faceImage">{this.state.faceImage ? <img src={"/api/" + this.state.faceImage} alt="faceImage" /> : null}</div>
        <div className="info">
          <div className="name">{this.props.person.name} </div>
          <div className="profession"> {this.state.professions.join(", ")}</div>
          <div className="rating-wrapper">
            <Star className="star" size={20} />
            <div className="average-rating"> {this.state.averageRating ? this.state.averageRating : null} </div>
            <div className="votes-amount"> {this.state.ratesQuantity ? this.state.ratesQuantity === "1" ? "(" + this.state.ratesQuantity + " vote)" : "(" + this.state.ratesQuantity + " votes)" : "Not rated yet"} </div>
          </div>
          <div className="details">
            {age ? <div><span className="category">Age:</span>{this.props.person.dod ? <span> &#10013;</span> : null} {age + " (" + (this.props.person.dob)}{this.props.person.dod ? " - " + this.props.person.dod : null}) </div> : null}
            <div><span className="category">Birthplace:</span> {this.props.person.birthplace}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(PersonDetailsMedium);
