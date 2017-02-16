import React, { Component } from 'react';
import axios from 'axios';

import SearchForm from './SearchForm.js'
import SearchResults from './SearchResults.js'

class SearchShows extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchStr: '',
      searchResults: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  handleChange({ target }) {
    this.setState({
      [target.name]: target.value
    });
  }

  handleSearchSubmit(event) {
    event.preventDefault();

    const query = `api/search/${ encodeURIComponent(this.state.searchStr) }`

    axios.get(query)
      .then(({ data }) => {
        this.setState({ searchResults: data })
      })
  }

  render() {
    const {
      state,
      props,
      handleChange,
      handleSearchSubmit,
    } = this;

    return (
      <div>
        <SearchForm
          searchStr={ state.searchStr }
          handleChange={ handleChange }
          handleSearchSubmit={ handleSearchSubmit }
        />
        <SearchResults
          toggleShowFavorite={props.toggleShowFavorite}
          searchResults={ state.searchResults }
          favoritesIds={ props.favoritesIds }
        />
      </div>
    )
  }
}

export default SearchShows;
