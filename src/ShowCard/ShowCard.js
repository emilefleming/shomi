import React from 'react'
import './ShowCard.css';

function trimString(str, length) {
  if (!str || str.length < length) {
    return str;
  }

  return `${str.slice(0, length - 3)}...`;
}

function ShowCard({ show, addShowToFavorites }) {
  return (
    <li>
      <img src={show.poster} alt={`${show.seriesName} Poster`} />
      <div className="details">
        <h3>{ show.seriesName }</h3>
        <p>{ trimString(show.overview, 90)}</p>
        <div className="subdetails">
          <div>{ show.network }</div>
          <div>{ show.firstAired.slice(0, 4) }</div>
          <a
            href="#"
            onClick={ () => { addShowToFavorites(show.id) } }
          >Favorite <i className="mdi mdi-heart"></i></a>
        </div>
      </div>
    </li>
  )
}

export default ShowCard;
