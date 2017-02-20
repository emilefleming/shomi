import React, { Component } from 'react';
import './CategoryContainer.css'

class CategoryContainer extends Component {
  constructor(props) {
    super(props)

    this.state = { open: this.props.open || false }

    this.toggleOpen = this.toggleOpen.bind(this);
  }


  toggleOpen() {
    this.setState({ open: !this.state.open})
  }

  render() {
    const { state, toggleOpen, props } = this;
    return (
      <div className="CategoryContainer">
        <h2 onClick={ toggleOpen }  className={ state.open ? null : 'closed' }>
          {props.title}
        </h2>
        <div className={ state.open ? null : 'hidden' }>
          { props.children }
        </div>
      </div>
    )
  }
}

export default CategoryContainer;
