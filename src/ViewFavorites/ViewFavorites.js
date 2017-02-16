import React from 'react';

export default function ViewFavorites(props) {
  return (
    <div>Favs
    {
      props.favorites.map( id => <div key={ id }>{ id }</div>)
    }
    </div>
  )
}
