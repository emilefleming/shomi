import React from 'react'
import ViewEpisodes from '../ViewEpisodes/ViewEpisodes.js'

export default function Home(props) {
  return (
    <ViewEpisodes userId={ props.userId }/>
  )
}
