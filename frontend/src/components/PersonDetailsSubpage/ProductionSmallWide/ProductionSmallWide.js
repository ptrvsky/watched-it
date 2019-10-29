import React from 'react';
import './ProductionSmallWide.scss';

export default class ProductionSmallWide extends React.Component {

  render() {
    return (
      <div className="production-small-wide-wrapper">
        <div className="year">{this.props.production.releaseDate.slice(0, 4)}</div>
        <div className="info-wrapper">
          <div className="title">{this.props.production.title}</div>
          {this.props.production.role === 'Actor' ?
            <div className="description description--actor">{this.props.production.description}</div> :
            <div className="description">{this.props.production.role}</div>}
        </div>
      </div>
    );
  }
}

