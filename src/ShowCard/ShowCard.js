import React, { Component } from 'react'
import './ShowCard.css';

class ShowCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hovering: false,
      favorites: JSON.parse(localStorage.getItem('favorites')) || []
    }

    this.handleHover = this.handleHover.bind(this)
    this.addShowToFavorites = this.addShowToFavorites.bind(this)
  }

  handleHover({ target }) {
    this.setState({ hovering: !this.state.hovering });
  }

  addShowToFavorites(id) {
    if (this.state.favorites.indexOf(id) > -1) {
      return;
    }
    console.log(id);
    const favorites = [...this.state.favorites, id]
    this.setState({ favorites });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    console.log(this.state.favorites);
  }

  render() {
    const { show, addShowToFavorites } = this.props;
    return (
      <li
        className="ShowCard"
        onMouseEnter={ this.handleHover }
        onMouseLeave={this.handleHover}
      >
        <img
          src={show.posterUrl || '/img/no_poster.png'}
          alt={`${show.seriesName} Poster`}
        />
        <div className="details">
          <h3>{ show.seriesName }</h3>
          <div className="subdetails">
            { show.network }
            <em>
              { show.firstAired ? show.firstAired.slice(0, 4): '' }
            </em>
            <p>{ trimString(show.overview, 110)}</p>
            {
              this.state.hovering
              ? <div className="hover-options">
                  <div className="favorite-button">
                    <i
                      className="mdi mdi-heart"
                      onClick={ () => { addShowToFavorites(show.id) } }
                    /> follow
                  </div>
              </div>
              : null
            }
          </div>
        </div>
      </li>
      )
  }
}

function trimString(str, length) {
  if (!str || str.length < length) {
    return str;
  }

  return `${str.slice(0, length - 3)}...`;
}

export default ShowCard;
