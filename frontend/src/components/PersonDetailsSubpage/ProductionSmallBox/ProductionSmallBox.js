import React from 'react';
import './ProductionSmallBox.scss';

export default class ProductionSmallBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      posterURL: null
    }
  }

  componentDidMount() {
    fetch('/api/images/' + this.props.production.posterId)
      .then(poster => poster.json())
      .then(poster => this.setState({ posterURL: poster.url }));
  }

  render() {
    return (
      <div className="production-small-box-wrapper">
        <div className="poster">{this.state.posterURL !== null ? <img src={"/api/" + this.state.posterURL} alt="poster" /> : null}</div>
        <div className="title">{this.props.production.title}</div>
      </div>
    );
  }
}

