import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory} from 'react-router';
import './App.css';

import SearchShows from './SearchShows/SearchShows.js';
import ViewFavorites from './ViewFavorites/ViewFavorites.js';
import Home from './Home/Home.js';
import Page from './Page.js';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      favorites: JSON.parse(localStorage.getItem('favorites')) || []
    }

    this.addShowToFavorites = this.addShowToFavorites.bind(this)
  }

  addShowToFavorites(id) {
    if (this.state.favorites.indexOf(id) > -1) {
      return;
    }
    console.log(id);
    const favorites = [...this.state.favorites, id]
    this.setState({ favorites });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    console.log(this.state.favorites);
  }

  render() {
    return (
      <Router history={ browserHistory }>
        <Route path="/" component={ Page }>
          <IndexRoute component={ Home } />
          <Route
            path="/search"
            component={ SearchShows }
            addShowToFavorites={ this.addShowToFavorites }
          />
          <Route path="/favorites" component={ ViewFavorites } />
        </Route>
      </Router>
    );
  }
}

export default App;
