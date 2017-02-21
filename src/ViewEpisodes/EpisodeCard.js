import React from 'react';
import './EpisodeCard.css'

import Card from '../Cards/Card'
import CardPoster from '../Cards/CardPoster'

export default function EpisodeCard(props) {
  const { episode } = props;
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
          ? <div className="tools">
              <i className="mdi mdi-checkbox-marked-circle-outline"/>
              <h5>WATCH</h5>
            </div>
          : null
        }
      </div>
    </Card>
  )
}
