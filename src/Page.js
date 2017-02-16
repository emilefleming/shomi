import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

import Header from './Header/Header.js';
import Sidebar from './Sidebar/Sidebar.js';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      favorites: [],
      favoritesIds: [],
      userId: 1
    }

    this.toggleSidebar = this.toggleSidebar.bind(this)
    this.toggleShowFavorite = this.toggleShowFavorite.bind(this)
  }

  componentDidMount() {
    axios.get(`/api/favorites/${this.state.userId}`)
      .then(({ data }) => {
        const favoritesIds = [...data].map(favorite => favorite.id)
        this.setState({ favorites: data, favoritesIds })
      })
  }

  toggleSidebar() {
    this.setState({ sideBarIsOpen: !this.state.sideBarIsOpen })
  }

  toggleShowFavorite(show) {
    const showIndexInFavorites = this.state.favoritesIds.indexOf(show.id);
    if (showIndexInFavorites > -1) {
      axios.delete(`/api/favorites/${this.state.userId}/${show.id}`)
        .then(deletedshow => {
          const favorites = [...this.state.favorites]
          const favoritesIds = [...this.state.favoritesIds]

          favorites.splice(showIndexInFavorites, 1)
          favoritesIds.splice(showIndexInFavorites, 1);

          return this.setState({ favoritesIds, favorites });
        })
    }
    else {
      axios.post(`/api/favorites/${this.state.userId}`, {showId: show.id})
        .then(newFavorite => {
          const favorites = [...this.state.favorites, show]
          const favoritesIds = [...this.state.favoritesIds, show.id]
          this.setState({ favorites, favoritesIds });
        })
    }

  }

  render() {
    const { state, props, toggleSidebar } = this;
    return (
      <div className="App">
        {
          state.sideBarIsOpen
          ? <Sidebar toggleSidebar={ toggleSidebar } />
          : null
        }

        <Header toggleSidebar={ toggleSidebar } />

        {
          React.cloneElement(props.children, {
            toggleShowFavorite: this.toggleShowFavorite,
            favorites: state.favorites,
            favoritesIds: state.favoritesIds
          })
         }
      </div>

    );
  }
}

export default App;
