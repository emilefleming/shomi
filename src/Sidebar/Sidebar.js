import React from 'react';
import { Link } from 'react-router'
import './Sidebar.css'

import Header from '../Header/Header'

export default function Sidebar(props) {
  return (
    <div className="Sidebar">
      <div className="background" onClick={ props.toggleSidebar }></div>
      <div className="content">
        <Header toggleSidebar={ props.toggleSidebar }/>
        <ul>
          <li><Link to="/search">Search</Link></li>
        </ul>
      </div>
    </div>
  )
}
