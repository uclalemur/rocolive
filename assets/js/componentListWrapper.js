// General List Component to contain several componentSave
// (e.g. multiple popups, multiple tab bars, and multiple subcomponents)

/*
ListOfComponents
  props:
    List of components to render,
    ComponentListName,
    ComponentListStyle
  other props:
    function calls bind to each component
*/

import React from 'react'

export default class ComponentListWrapper extends React.Component {
  constructor(props) {
    var {
      ComponentListName,
      ComponentListStyle
    } = this.props;
  }

  fillComponentList() {
    /* to be overridden */
  }

  //
  render() {
    return (
      <div className={this.ComponentListName}>
        {this.fillComponentList()}
      </div>
    )
  }

}
