import React from 'react';
import './Sidebar.css'

import Header from '../Header/Header'

export default function Sidebar(props) {
  return (
    <div className="Sidebar">
      <div className="background" onClick={ props.toggleSidebar }></div>
      <div className="content">
        <Header toggleSidebar={ props.toggleSidebar }/>
      </div>
    </div>
  )
}
