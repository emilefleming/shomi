import React, { Component } from 'react';
import axios from 'axios';

import CardList from '../Cards/CardList'
import Card from '../Cards/Card'

class ViewEpisodes extends Component {
  constructor(props) {
    super(props)

    this.state = { episodes: [] };
    this.mapEpisodeCards = this.mapEpisodeCards.bind(this);
  }

  mapEpisodeCards(episode) {
    return (
      <Card key={episode.id}>
        <div className="EpisodeCard">
          
        </div>
      </Card>
    )
  }

  componentDidMount() {
    axios.get('/api/favorites/1/episodes')
      .then( response => {
        console.log(response);
        this.setState({ episodes: response.data });
      })
  }

  render() {
    return (
      <CardList
        cardsList={this.state.episodes}
        mapCards={this.mapEpisodeCards}
      />
    )
  }
}

export default ViewEpisodes;
