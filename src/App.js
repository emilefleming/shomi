import React, { Component } from 'react';
import { Router, Route, browserHistory} from 'react-router';
import './App.css';

import SearchShows from './SearchShows/SearchShows.js';
import Header from './Header/Header.js';
import Sidebar from './Sidebar/Sidebar.js';

const routes = (
  <Route path="/search" component={ SearchShows } />
)


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {};

    this.toggleSidebar = this.toggleSidebar.bind(this)
  }

  toggleSidebar() {
    this.setState({ sideBarIsOpen: !this.state.sideBarIsOpen })
  }

  render() {
    const { state, toggleSidebar } = this;
    return (
      <div className="App">
        {
          this.state.sideBarIsOpen
          ? <Sidebar toggleSidebar={ toggleSidebar } />
          : null
        }
        <Header toggleSidebar={ toggleSidebar } />
        <Router history={ browserHistory }>
          { routes }
        </Router>

      </div>

    );
  }
}

export default App;
