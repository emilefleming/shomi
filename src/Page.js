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
      userId: 1
    }

    this.toggleSidebar = this.toggleSidebar.bind(this)
    this.addShowToFavorites = this.addShowToFavorites.bind(this)
  }

  componentDidMount() {
    axios.get(`/api/favorites/${this.state.userId}`)
      .then(({ data }) => {
        this.setState({ favorites: data })
      })
  }

  toggleSidebar() {
    this.setState({ sideBarIsOpen: !this.state.sideBarIsOpen })
  }

  addShowToFavorites(id) {
    if (this.state.favorites.indexOf(id) > -1) {
      return;
    }

    const favorites = [...this.state.favorites, id]
    this.setState({ favorites });
    localStorage.setItem('favorites', JSON.stringify(favorites));
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
            addShowToFavorites: this.addShowToFavorites,
            favorites: this.state.favorites
          })
         }
      </div>

    );
  }
}

export default App;
