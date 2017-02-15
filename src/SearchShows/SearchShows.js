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
        console.log(data);
        this.setState({ searchResults: data })
      })
  }

  render() {
    console.log(this);
    const {
      state,
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
          addShowToFavorites={this.props.route.addShowToFavorites}
          searchResults={ state.searchResults }
        />
      </div>
    )
  }
}

export default SearchShows;
