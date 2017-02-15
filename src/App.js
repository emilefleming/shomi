import React, { Component } from 'react';
import { Router, Route, browserHistory} from 'react-router';
import './App.css';

import SearchShows from './SearchShows/SearchShows.js';
import Header from './Header/Header.js';
import Sidebar from './Sidebar/Sidebar.js';
import Home from './Home/Home.js';

const router = (
  <Router history={ browserHistory }>
    <Route path="/" component={ Home } />
    <Route path="/search" component={ SearchShows } />
  </Router>
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
        { router }
      </div>

    );
  }
}

export default App;
