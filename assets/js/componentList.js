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
import ListOfThings from './listOfThings'
export default class ComponentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    }
  }

  addComponent(comp) {
    // add subcomponent of type comp[0]
    this.props.addSubcomponent(comp[0]);
  }

  render() {
    return (
      <div id="sidebar-wrapper" style={{color: '#33b5e5'}}>

        <i className={(this.state.expanded) ? "fa fa-caret-down" : "fa fa-caret-right"} aria-hidden="true"></i>
        <div style={{display: 'inline'}} onClick={() => this.setState({expanded: !this.state.expanded})}> Components </div>
        {(this.state.expanded) ?

        <ul className="sidebar-nav">
            {this.props.componentList.map((comp) => {
              return (<li onClick={this.addComponent.bind(this, comp)} style={{height: 30}}>
                <a href="#">{comp[0]}</a>
                </li>);
            })}
        </ul> : null}
      </div>
    );
  }
}

/*
<ListOfThings listClassName="sidebar-nav" elementName="component" elementStyle={{height: 30}} container="ul"
elementClassName="componentListElement">

</ListOfThings>
*/
