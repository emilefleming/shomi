import React, { Component } from 'react';
import './App.css';

import Header from './Header/Header.js';
import Sidebar from './Sidebar/Sidebar.js';

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
        { this.props.children }
      </div>

    );
  }
}

export default App;
