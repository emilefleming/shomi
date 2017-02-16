import React from 'react';
import { Router, Route, IndexRoute, browserHistory} from 'react-router';
import './App.css';

import SearchShows from './SearchShows/SearchShows.js';
import ViewFavorites from './ViewFavorites/ViewFavorites.js';
import Home from './Home/Home.js';
import Page from './Page.js';

function App() {
  return (
    <Router history={ browserHistory }>
      <Route path="/" component={ Page }>
        <IndexRoute component={ Home } />
        <Route
          path="/search"
          component={ SearchShows }
        />
        <Route path="/favorites" component={ ViewFavorites } />
      </Route>
    </Router>
  );
}

export default App;
