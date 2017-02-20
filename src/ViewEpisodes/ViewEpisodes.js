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
              <h4>{ episode.readableDate }</h4>
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
          future: {
            title: 'Over 1 week ahead',
            eps: []
          },
          soon: {
            title: 'Week ahead',
            eps: []
          },
          tomorrow: {
            title: 'Tomorrow',
            eps: []
          },
          today: {
            title: 'Today',
            eps: []
          },
          yesterday: {
            title: 'Yesterday',
            eps: []
          },
          recent: {
            title: 'Week Ago',
            eps: []
          },
          old: {
            title: 'Over 1 week ago',
            eps: []
          }
        };
        const today = moment(new Date().toISOString().slice(0, 10));

        response.data.map( episode => {
          const { firstAired } = episode;
          const airedMoment = moment(firstAired);
          const daysOld = today.diff(airedMoment, 'days');

          episode.readableDate = airedMoment.format('dddd, MMMM Do')

          if (daysOld <= -7) {
            return dates.future.eps.push(episode)
          }

          if (daysOld < -1 && daysOld > -7) {
            return dates.soon.eps.push(episode)
          }

          if (daysOld === -1) {
            return dates.tomorrow.eps.push(episode)
          }

          if (daysOld === 0) {
            return dates.today.eps.push(episode)
          }

          if (daysOld === 1) {
            return dates.yesterday.eps.push(episode)
          }

          if (daysOld > 0 && daysOld < 7) {
            return dates.recent.eps.push(episode)
          }

          if (today.year() !== airedMoment.year()) {
            episode.readableDate = airedMoment.format('dddd, MMMM Do YYYY')
          }

          if (daysOld >= 7) {
            return dates.old.eps.push(episode)
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

            if (!this.state.dates[ele].eps.length) {
              return null
            }
            if (openByDefault.indexOf(ele) > -1) {
              isOpen = true;
            }

            console.log(ele.title);
            return (
              <CategoryContainer key={ele} title={this.state.dates[ele].title} open={isOpen}>
                <CardList
                  cardsList={this.state.dates[ele].eps}
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
