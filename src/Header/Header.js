import React from 'react';
import './Header.css'

import SidebarToggle from '../Sidebar/SidebarToggle'

export default function Header(props) {
  return (
    <nav className="Header">
      {
        props.userId
          ? props.userId
          : <button onClick={props.toggleLogin}>Log In</button>
      }
      <div className="logo">shomi</div>
      <SidebarToggle toggleSidebar={props.toggleSidebar} />
    </nav>
  )
}
