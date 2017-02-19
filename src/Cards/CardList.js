import React from 'react';
import './CardList.css'

export default function CardList(props) {
  return (
    <ul className="CardList">
      {
        props.cardsList.map(props.mapCards)
      }
    </ul>
  )
}
