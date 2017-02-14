import React from 'react';
import './SearchForm.css'

function SearchForm(props) {
  return (
    <form onSubmit={props.handleSearchSubmit}>
      <div className="SearchForm-input-wrapper">
        <input
          type="text"
          name="searchStr"
          placeholder="Search ..."
          value={props.searchStr}
          onChange={props.handleChange}
        />
      </div>
      <button>GO</button>
    </form>
  );
}

export default SearchForm;
