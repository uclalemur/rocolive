import React from 'react'

export default function NavTab(props) {
  return (
    <div className="nav-item" style={{display: "block"}}>
      <a className="nav-link" href="#">{props.name} <span className="sr-only">(current)</span></a>
    </div>
  )
}
