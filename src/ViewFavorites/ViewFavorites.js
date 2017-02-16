import React from 'react';
import SearchResults from '../SearchShows/SearchResults.js'

export default function ViewFavorites(props) {
  return (
    <SearchResults
      searchResults={props.favorites} toggleShowFavorite={props.toggleShowFavorite}
      favoritesIds={props.favoritesIds}
    />
  )
}
