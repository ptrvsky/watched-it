import React from 'react';
import './RateButton.scss';
import { Star } from 'react-feather';

export default class RateButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rateHovered: this.props.rate || null,
    };
    this.onHover = this.onHover.bind(this);
    this.onLeave = this.onLeave.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onHover(event) {
    this.setState({
      rateHovered: event.target.id
    });
  }

  onLeave() {
    this.setState({
      rateHovered: this.props.rate || null
    })
  }

  onClick(event) {
    this.props.handleRatingChange(event.target.id);
  }

  render() {
    return (
      <div className="rate-button-wrapper" onMouseLeave={this.onLeave} >
        <Star className={this.state.rateHovered >= 1 ? "star star--checked" : "star"} id="1" onMouseEnter={this.onHover} onClick={this.onClick} size={22} />
        <Star className={this.state.rateHovered >= 2 ? "star star--checked" : "star"} id="2" onMouseEnter={this.onHover} onClick={this.onClick} size={22} />
        <Star className={this.state.rateHovered >= 3 ? "star star--checked" : "star"} id="3" onMouseEnter={this.onHover} onClick={this.onClick} size={22} />
        <Star className={this.state.rateHovered >= 4 ? "star star--checked" : "star"} id="4" onMouseEnter={this.onHover} onClick={this.onClick} size={22} />
        <Star className={this.state.rateHovered >= 5 ? "star star--checked" : "star"} id="5" onMouseEnter={this.onHover} onClick={this.onClick} size={22} />
        <Star className={this.state.rateHovered >= 6 ? "star star--checked" : "star"} id="6" onMouseEnter={this.onHover} onClick={this.onClick} size={22} />
        <Star className={this.state.rateHovered >= 7 ? "star star--checked" : "star"} id="7" onMouseEnter={this.onHover} onClick={this.onClick} size={22} />
        <Star className={this.state.rateHovered >= 8 ? "star star--checked" : "star"} id="8" onMouseEnter={this.onHover} onClick={this.onClick} size={22} />
        <Star className={this.state.rateHovered >= 9 ? "star star--checked" : "star"} id="9" onMouseEnter={this.onHover} onClick={this.onClick} size={22} />
        <Star className={this.state.rateHovered >= 10 ? "star star--checked" : "star"} id="10" onMouseEnter={this.onHover} onClick={this.onClick} size={22} />
      </div>
    );
  }
}
