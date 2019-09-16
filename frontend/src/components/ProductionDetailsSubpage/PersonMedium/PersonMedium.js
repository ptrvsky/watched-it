import React from 'react';
import './PersonMedium.scss';

export default class PersonMedium extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      faceImage: null,
    }
  }

  componentDidMount() {
    fetch('/api/images/' + this.props.person.faceImageId)
      .then(faceImage => faceImage.json())
      .then(faceImage => this.setState({ faceImage: faceImage.url }));
  }

  render() {
    return (
      <div className="person-medium-wrapper">
        <div className="face-image">{this.state.faceImage !== null ? <img src={"/api/" + this.state.faceImage } alt="poster" /> : null }</div>
        <div className="info">
          <div className="name">{this.props.person.name}</div>
          <div className="description">{this.props.person.role === 'Actor' ? this.props.person.description : this.props.person.role }</div>
        </div>
      </div>
    );
  }
}

