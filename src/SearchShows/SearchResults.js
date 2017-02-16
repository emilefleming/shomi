import React from 'react';
import './SearchResults.css'
import ShowCard from '../ShowCard/ShowCard.js'

function SearchResults(props) {
  return (
    <div className="SearchResults">
      <ul>
        {
          props.searchResults.map(show => {
            if (!show.status || show.status === 'Ended') {
              return null;
            }

            show.isFavorite = props.favoritesIds.indexOf(show.id) > -1;

            return (
              <ShowCard
                key={ show.id }
                show={ show }
                toggleShowFavorite={ props.toggleShowFavorite }/>
            )
          })
        }

      </ul>
    </div>
  );
}

export default SearchResults;
