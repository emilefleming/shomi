import React, { Component } from 'react';
import './App.css';

import Header from './Header/Header.js';
import Sidebar from './Sidebar/Sidebar.js';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      favorites: JSON.parse(localStorage.getItem('favorites')) || []
    }

    this.toggleSidebar = this.toggleSidebar.bind(this)
    this.addShowToFavorites = this.addShowToFavorites.bind(this)
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
    console.log(this.state.favorites);
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
