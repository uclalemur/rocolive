/*
Component List Component containing components to be displayed
as list elements.

ComponentList (inheriting from ComponentListWrapper)
  props:
    List of components to render,
    ComponentListName,
    ComponentListStyle
  other props:
    function calls bind to each component
*/
import React, {Component} from 'react'
export default class ComponentList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="sidebar-wrapper">
          <ul className="sidebar-nav">
              <li className="sidebar-brand">
                  <a href="#">
                      Start Bootstrap
                  </a>
              </li>
              {this.props.componentList.map((comp) => {
                return (<li>
                  <a href="#">{comp[0]}</a>
                  </li>);
              })}
          </ul>
      </div>
    );
  }
}
