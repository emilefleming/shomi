import React from 'react';
import './SearchResults.css'

function trimString(str, length) {
  if (!str || str.length < length) {
    return str;
  }

  return `${str.slice(0, length - 3)}...`;
}

function SearchResults(props) {
  return (
    <div className="SearchResults">
      <ul>
        {
          props.searchResults.map(show => {
            if (!show.status || show.status === 'Ended') {
              return null;
            }
            console.log(show);
            return (
              <li key={ show.id }>
                <img src={show.poster} alt={`${show.seriesName} Poster`} />
                <div className="details">
                  <h3>{ show.seriesName }</h3>
                  <p>{ trimString(show.overview, 90)}</p>
                  <div className="subdetails">
                    <div>{ show.network }</div>
                    <div>{ show.firstAired.slice(0, 4) }</div>
                  </div>
                </div>
              </li>
            )
          })
        }

      </ul>
    </div>
  );
}

export default SearchResults;
