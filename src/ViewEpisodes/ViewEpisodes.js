import React, { Component } from 'react';
import axios from 'axios';

class ViewEpisodes extends Component {
  constructor(props) {
    super(props)

    this.state = { episodes: [] };
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
      <div>
        {
          this.state.episodes.map( episode =>
            <div key={episode.id}>
              {episode.episodeName}
            </div>
          )
        }
      </div>
    )
  }
}

export default ViewEpisodes;
