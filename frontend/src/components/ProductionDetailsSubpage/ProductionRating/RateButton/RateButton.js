import React from 'react';
import './RateButton.scss';
import { Star } from 'react-feather';
import { withRouter } from 'react-router';

class RateButton extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      rateHovered: null,
      userRating: null,
      user: {
        status: 'NOT_LOGGED',
      },
    };
    this.onHover = this.onHover.bind(this);
    this.onLeave = this.onLeave.bind(this);
    this.onClick = this.onClick.bind(this);
    this.handleRatingChange = this.handleRatingChange.bind(this);
  }

  handleRatingChange(newRating) {
    // Reset user rating if user press on the same star again
    if (this.state.userRating === newRating) {
      newRating = null;
    }

    // Add or update user rate in the database
    fetch('/api/rates', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productionId: this.props.productionId,
        userId: this.state.user.id,
        value: newRating,
      })
    })
      .then((rate) => rate.json())
      .then((rate) => {
        this.setState({
          rateHovered: rate.value,
          userRating: rate.value,
        })
        this.props.fetchRatingStats();  // Refresh average rating
      });
  }

  onHover(event) {
    this.setState({
      rateHovered: event.target.id
    });
  }

  onLeave() {
    this.setState((state) => {
      return { rateHovered: state.userRating || null }
    })
  }

  onClick(event) {
    if (this.state.user.status === 'LOGGED') {
      this.handleRatingChange(event.currentTarget.id);
    } else {
      this.props.history.push('/login?unauthenticatedRateTry=true');
    }
  }

  componentDidMount() {
    // Fetch information about currently logged user and its rate
    fetch('/api/users/auth')
      .then((user) => user.json())
      .then((user) => this.setState({ user }))
      .then(() => {
        if (this.state.user.status === 'LOGGED') {
          fetch('/api/rates/productions/' + this.props.productionId + '/users/' + this.state.user.id)
            .then((rate) => rate.json())
            .then((rate) => {
              if (rate) {
                this.setState({
                  rateHovered: rate.value,
                  userRating: rate.value,
                });
              };
            });
        };
      });
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

export default withRouter(RateButton);
