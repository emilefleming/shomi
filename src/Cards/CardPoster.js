import React from 'react';
import './CardPoster.css'

export default function CardPoster({ url, alt }) {
  return (
    <img
      className="CardPoster"
      src={ url || '/img/no_poster.png'  }
      alt={ `${alt} Poster` }
    />
  )
}
