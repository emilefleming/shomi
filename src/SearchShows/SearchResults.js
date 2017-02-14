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
            return (
              <ShowCard key={ show.id } show={ show }/>
            )
          })
        }

      </ul>
    </div>
  );
}

export default SearchResults;
