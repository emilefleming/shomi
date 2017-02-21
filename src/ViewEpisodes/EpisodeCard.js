import React, { Component } from 'react';
import './EpisodeCard.css'

import Card from '../Cards/Card'
import CardPoster from '../Cards/CardPoster'

class EpisodeCard extends Component {
  constructor(props) {
    super(props)

    this.state = {};

    this.watchEpisode = this.watchEpisode.bind(this);
    this.unwatchEpisode = this.unwatchEpisode.bind(this);
  }

  watchEpisode() {
    this.setState({ isWatched: true })
    this.props.watchEpisode(this.props.episode.id)
  }

  unwatchEpisode() {
    this.setState({ isWatched: false })
    this.props.unwatchEpisode(this.props.episode.id)
  }

  render() {
    const { episode } = this.props;
    return (
      <Card key={episode.id}>
        <div className="episode-card">
          <CardPoster url={ episode.posterUrl } alt={ episode.episodeName } />
          <div className="details">
            <div>
              <h3>{ episode.episodeName }</h3>
              <h4>{ episode.seriesName }</h4>
              <h4>{ episode.readableDate }</h4>
            </div>
            <div className="season-episode">
              Season <strong>{episode.airedSeason}</strong> episode <strong>{ episode.airedEpisodeNumber || '#'}</strong>
            </div>
          </div>
          {
            episode.hasAired
            ? <WatchButton watchEpisode={this.watchEpisode} unwatchEpisode={ this.unwatchEpisode } isWatched={this.state.isWatched} />
            : null
          }
        </div>
      </Card>
    )
  }
}

function WatchButton(props) {
  const { isWatched, watchEpisode, unwatchEpisode } = props;
  return(
    <div
      className={`tools${isWatched ? ' watched' : ''}`}
      onClick={isWatched ? unwatchEpisode : watchEpisode}
    >
        <i className={
          `mdi mdi-checkbox-marked-circle${isWatched ? '' : '-outline'}`
        }/>
      <h5>{ isWatched ? 'undo' : 'watch'}</h5>
    </div>
  )
}

export default EpisodeCard;
