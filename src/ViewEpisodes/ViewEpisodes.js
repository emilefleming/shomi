import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment'
import './ViewEpisodes.css'

import CardList from '../Cards/CardList'
import CategoryContainer from './CategoryContainer'
import EpisodeCard from './EpisodeCard'

class ViewEpisodes extends Component {
  constructor(props) {
    super(props)

    this.state = { dates: {}, allEpisodes: [] };

    this.watchEpisode = this.watchEpisode.bind(this);
    this.unwatchEpisode = this.unwatchEpisode.bind(this);
  }

  watchEpisode(id) {
    axios.post(`/api/episodes/watch/${this.props.userId}`, [id])
      .catch( err => { console.log(err) })
  }

  unwatchEpisode(id) {
    axios({
      method: 'delete',
      url: `/api/episodes/watch/${this.props.userId}`,
      data: [id]
    })
      .catch( err => { console.log(err);})
  }

  componentDidUpdate() {
    if (this.state.allEpisodes.length || !this.props.userId) {
      return;
    }

    axios.get(`/api/favorites/${this.props.userId}/episodes`)
      .then( response => {
        this.setState({ allEpisodes: response.data });
        this.setState({ dates: sortEpisodes(this.state.allEpisodes) });
      })
  }

  render() {
    if (!Object.keys(this.state.dates).length) {
      return <div>Loading</div>;
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

            return (
              <CategoryContainer key={ele} title={this.state.dates[ele].title} open={isOpen}>
                <CardList
                  cardsList={this.state.dates[ele].eps}
                  mapCards={ episode => <EpisodeCard key={episode.id} episode={episode} watchEpisode={this.watchEpisode} unwatchEpisode={this.unwatchEpisode}/>}
                />
              </CategoryContainer>
            )
          })
        }
      </div>
    )
  }
}

function sortEpisodes(episodesArr) {
  const today = moment(new Date().toISOString().slice(0, 10));
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

  episodesArr.map( episode => {
    const { firstAired } = episode;
    const airedMoment = moment(firstAired);
    const daysOld = today.diff(airedMoment, 'days');

    episode.readableDate = airedMoment.format('dddd, MMMM Do')

    if (daysOld > - 1) {
      episode.hasAired = true;
    }

    if (daysOld <= -7) {
      dates.future.eps.push(episode)
    }

    if (daysOld < -1 && daysOld > -7) {
      dates.soon.eps.push(episode)
    }

    if (daysOld === -1) {
      dates.tomorrow.eps.push(episode)
    }

    if (daysOld === 0) {
      dates.today.eps.push(episode)
    }

    if (daysOld === 1) {
      dates.yesterday.eps.push(episode)
    }

    if (daysOld > 0 && daysOld < 7) {
      dates.recent.eps.push(episode)
    }

    if (today.year() !== airedMoment.year()) {
      episode.readableDate = airedMoment.format('dddd, MMMM Do YYYY')
    }

    if (daysOld >= 7) {
      dates.old.eps.push(episode)
    }

    return null;
  })

  return dates;
}

export default ViewEpisodes;
