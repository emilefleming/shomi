import React from 'react';
import './Header.css'

import SidebarToggle from '../Sidebar/SidebarToggle'

export default function Header(props) {
  return (
    <nav className="Header">
      <div className="logo">OGTV</div>
      <SidebarToggle toggleSidebar={props.toggleSidebar} />
    </nav>
  )
}
