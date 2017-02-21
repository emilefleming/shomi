import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

import Header from './Header/Header.js';
import Sidebar from './Sidebar/Sidebar.js';
import LoginForm from './LoginForm/LoginForm.js';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      favorites: [],
      favoritesIds: [],
      userId: null,
      loginEmail: '',
      loginPassword: '',
      email: '',
      password: '',
      username: '',
      confirmPassword: ''
    }

    this.toggleSidebar = this.toggleSidebar.bind(this)
    this.toggleLogin = this.toggleLogin.bind(this)
    this.toggleShowFavorite = this.toggleShowFavorite.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.submitLogin = this.submitLogin.bind(this)
  }

  componentDidMount() {
    axios.get('/api/users')
      .then( response => {
        this.setState({ userId: response.data.id })

        return axios.get(`/api/favorites/${this.state.userId}`)
      })
      .then(({ data }) => {
        const favoritesIds = [...data].map(favorite => favorite.id)
        this.setState({ favorites: data, favoritesIds })
      })
      .catch( err => { this.setState({ loginIsOpen: true }) })
  }

  toggleSidebar() {
    this.setState({ sideBarIsOpen: !this.state.sideBarIsOpen })
  }
  toggleLogin() {
    this.setState({ loginIsOpen: !this.state.loginIsOpen })
  }

  handleChange({ target }) {
    this.setState({
      [target.id]: target.value
    });
  }

  submitLogin(event) {
    event.preventDefault();
    return new Promise((resolve, reject) => {
      if (event.target.name === 'loginForm') {
        return resolve(axios.post('/api/token', {
          email: this.state.loginEmail,
          password: this.state.loginPassword
        }));
      }
    })
    .then( response => {
      this.setState({ userId: response.data.id, loginIsOpen: false })
      return axios.get(`/api/favorites/${this.state.userId}`)
    })
    .then(({ data }) => {
      const favoritesIds = [...data].map(favorite => favorite.id)
      this.setState({ favorites: data, favoritesIds })
    })
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

        <Header
          toggleSidebar={ toggleSidebar }
          toggleLogin={ this.toggleLogin }
          userId={ this.state.userId }
        />

        {
          this.state.loginIsOpen
            ? <LoginForm
                loginEmail={this.state.loginEmail}
                loginPassword={this.state.loginPassword}
                email={this.state.email}
                password={this.state.password}
                username={this.state.username}
                confirmPassword={this.state.confirmPassword}
                handleChange={this.handleChange}
                submitLogin={this.submitLogin}
              />
            : null
        }

        {
          React.cloneElement(props.children, {
            userId: this.state.userId,
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
