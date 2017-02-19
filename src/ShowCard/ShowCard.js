import React from 'react'
import './ShowCard.css';
import Card from '../Cards/Card'
import CardPoster from '../Cards/CardPoster'

export default function ShowCard(props) {
  const { show, toggleShowFavorite } = props;
  return (
    <Card>
      <div className="ShowCard">
        <CardPoster
          url={ props.show.posterUrl }
          alt={ show.seriesName }
        />
        <div className="details">
          <h3>
            { show.seriesName }
            <i
              className={
                `mdi mdi-${show.isFavorite ? 'heart' : 'heart-outline'}`
              }
              onClick={ () => { toggleShowFavorite(show) } }
            />
          </h3>
          <div className="subdetails">
            { show.network }
            <em>
              { show.firstAired ? show.firstAired.slice(0, 4): '' }
            </em>
            <p>{ trimString(show.overview, 110)}</p>
          </div>
        </div>
    </div>
    </Card>
  )
}

function trimString(str, length) {
  if (!str || str.length < length) {
    return str;
  }

  return `${str.slice(0, length - 3)}...`;
}
