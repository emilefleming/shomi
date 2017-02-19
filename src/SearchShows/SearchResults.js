import React, { Component } from 'react';
import './SearchResults.css'
import CardList from '../Cards/CardList.js'
import ShowCard from '../ShowCard/ShowCard.js'

class SearchResults extends Component {
  constructor(props) {
    super(props)

    this.mapSearchResults = this.mapSearchResults.bind(this);
  }

  mapSearchResults(show) {
    if (!show.status || show.status === 'Ended') {
      return null;
    }

    show.isFavorite = this.props.favoritesIds.indexOf(show.id) > -1;

    return (
      <ShowCard
        key={ show.id }
        show={ show }
        toggleShowFavorite={ this.props.toggleShowFavorite }/>
    )
  }

  render () {
    return (
      <div className="SearchResults">
        <CardList mapCards={this.mapSearchResults} cardsList={this.props.searchResults}/>
      </div>
    )
  }
}

export default SearchResults;
