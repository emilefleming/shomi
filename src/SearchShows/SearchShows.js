import React, { Component } from 'react';
import axios from 'axios';

import SearchForm from './SearchForm.js'
import SearchResults from './SearchResults.js'

class SearchShows extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchStr: '',
      searchResults: [],
      favorites: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.addShowToFavorites = this.addShowToFavorites.bind(this);
  }

  handleChange({ target }) {
    this.setState({
      [target.name]: target.value
    });
  }

  handleSearchSubmit(event) {
    event.preventDefault();

    const query = `http://localhost:8001/search/${ encodeURIComponent(this.state.searchStr) }`

    axios.get(query)
      .then(({ data }) => {
        this.setState({ searchResults: data })
      })
  }

  addShowToFavorites(id) {
    console.log(id);
    const favorites = [...this.state.favorites, id]
    this.setState({ favorites });
    console.log(this.state);
  }

  render() {
    const {
      state,
      handleChange,
      handleSearchSubmit,
      addShowToFavorites
    } = this;

    return (
      <div>
        <SearchForm
          searchStr={ state.searchStr }
          handleChange={ handleChange }
          handleSearchSubmit={ handleSearchSubmit }
        />
        <SearchResults
          searchResults={ state.searchResults }
          addShowToFavorites={ addShowToFavorites }
        />
      </div>
    )
  }
}

export default SearchShows;
