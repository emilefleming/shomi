import React from 'react';
import './Card.css';

export default function Card(props) {
    return (
      <li className="Card">
        { props.children }
      </li>
    )
}
