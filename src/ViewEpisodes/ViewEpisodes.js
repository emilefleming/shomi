import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment'
import './ViewEpisodes.css'

import CardList from '../Cards/CardList'
import Card from '../Cards/Card'
import CardPoster from '../Cards/CardPoster'
import CategoryContainer from './CategoryContainer'

class ViewEpisodes extends Component {
  constructor(props) {
    super(props)

    this.state = { dates: {} };
    this.mapEpisodeCards = this.mapEpisodeCards.bind(this);
  }

  mapEpisodeCards(episode) {
    return (
      <Card key={episode.id}>
        <div className="episode-card">
          <CardPoster url={ episode.posterUrl } alt={ episode.episodeName } />
          <div className="details">
            <div>
              <h3>{ episode.episodeName }</h3>
              <h4>{ episode.seriesName }</h4>
              <h4>{ episode.firstAired }</h4>
            </div>
            <div className="season-episode">
              Season <strong>{episode.airedSeason}</strong> episode <strong>{ episode.airedEpisodeNumber || '#'}</strong>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  componentDidMount() {
    axios.get('/api/favorites/1/episodes')
      .then( response => {
        const dates = {
          future: [],
          soon: [],
          tomorrow: [],
          today: [],
          yesterday: [],
          recent: [],
          old: []
        };
        const todayRaw = new Date().setUTCHours(0,0,0,0)
        const today = moment(new Date().toISOString().slice(0, 10));

        response.data.map( episode => {
          const { firstAired } = episode;
          const daysOld = today.diff(moment(firstAired), 'days');

          if (daysOld <= -7) {
            return dates.future.push(episode)
          }

          if (daysOld < -1 && daysOld > -7) {
            return dates.soon.push(episode)
          }

          if (daysOld === -1) {
            return dates.tomorrow.push(episode)
          }

          if (daysOld === 0) {
            return dates.today.push(episode)
          }

          if (daysOld === 1) {
            return dates.yesterday.push(episode)
          }

          if (daysOld > 0 && daysOld < 7) {
            return dates.recent.push(episode)
          }

          if (daysOld >= 7) {
            return dates.old.push(episode)
          }

          return null;
        })

        console.log(dates);
        this.setState({ dates });
      })
  }

  render() {
    if (!Object.keys(this.state.dates).length) {
      return <div>asasasa</div>;
    }

    return (
      <div className="ViewEpisodes">
        {
          Object.keys(this.state.dates).map( ele => {
            const openByDefault = ['today', 'recent', 'yesterday']
            let isOpen;

            if (!this.state.dates[ele].length) {
              return null
            }
            if (openByDefault.indexOf(ele) > -1) {
              isOpen = true;
            }

            return (
              <CategoryContainer key={ele} title={ele} open={isOpen}>
                <CardList
                  cardsList={this.state.dates[ele]}
                  mapCards={this.mapEpisodeCards}
                />
              </CategoryContainer>
            )
          })
        }
      </div>
    )
  }
}

export default ViewEpisodes;
