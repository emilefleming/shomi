import React from 'react';
import './SidebarToggle.css'

export default function SidebarToggle(props) {
  return(
    <i onClick={ props.toggleSidebar } className="mdi mdi-menu" />
  )
}
