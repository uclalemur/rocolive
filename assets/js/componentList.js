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
    var scType = comp[0]
    var scName = window.prompt("Name for new " + scType);

    // check ComponentName
    
    // add subcomponent of type comp[0]
    this.props.addSc(scName, scType);
  }

  render() {
    return (

      <div id="sidebar-wrapper">
        <div style=
          {{color: '#33b5e5', height: 320, overflow: 'auto'}}
           className='force-overflow'>
          <i className={(this.state.expanded) ? "fa fa-caret-down" : "fa fa-caret-right"} aria-hidden="true"></i>
          <div style={{display: 'inline'}} onClick={() => this.setState({expanded: !this.state.expanded})}> Components </div>
          {(this.state.expanded) ?

          <ul className="sidebar-nav" style={{listStyleType: 'none'}}>
              {this.props.componentList.map((comp) => {
                return (<li onClick={this.addComponent.bind(this, comp)} style={{height: 30}}>
                  <a href="#">{comp[0]}</a>
                  </li>);
              })}
          </ul> : null}
        </div>
        <div className="svgDisplay" dangerouslySetInnerHTML={this.props.svg} style={{height: 250, width: 250}}>
        </div>
      </div>
    );
  }
}

/*
<ListOfThings listClassName="sidebar-nav" elementName="component" elementStyle={{height: 30}} container="ul"
elementClassName="componentListElement">

</ListOfThings>
*/
