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

  addComponent(comp) {
    // add subcomponent of type comp[0]
    this.props.addSubcomponent(comp[0]);
  }

  render() {
    return (
      <div id="sidebar-wrapper">
          <ul className="sidebar-nav">
              {this.props.componentList.map((comp) => {
                return (<li onClick={this.addComponent.bind(this, comp)} style={{height: 30}}>
                  <a href="#">{comp[0]}</a>
                  </li>);
              })}
          </ul>
      </div>
    );
  }
}
