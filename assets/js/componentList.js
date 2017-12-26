/*
Component List Component containing components to be displayed
as list elements.

ComponentList
  props:
    List of components to render,
    ComponentListName,
    ComponentListStyle
  other props:
    function calls bind to each component
*/
import React, {Component} from 'react'
import ListOfThings from './listOfThings'
import SVG from './svg'

export default class ComponentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    }
  }

  addComponent(comp) {
    var scType = comp[0]
    var scName;
    var a = true;

    while (a) {
      // default value is the scName+{count+1}
      scName = window.prompt("Name for new " + scType, scType+this.props.subcomponentCounts[scType]);
      console.log('scName', scName, scName.length, parseInt(scName[0]))
      if (scName.length != 0 && isNaN(parseInt(scName[0]))) {
        a = Object.keys(this.props.subcomponents).map(key => this.props.subcomponents[key].name)
          .reduce((same, _scName) => {
            if (_scName == scName) {
              console.log('same')
              return true;
            }
          }, false)
          console.log('a', a)
      }
    }


    // check ComponentName
    // add subcomponent of type comp[0]
    this.props.addSc(scName, scType);
  }

  render() {
    return (

      <div id="sidebar-wrapper">
        <div style=
          {{color: '#fff', height: '90%', overflow: 'auto'}}
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
          <div>
            <SVG style={{height: 250, width: 250}} svg={this.props.svg} className="smallSVGDisplay" />
          </div>
        </div>
      </div>
    );
  }
}
