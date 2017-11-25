/*
Subcomponent:
  maintains parameters, subcomponent parameters, and constraints of a subcomponents
  params:
    subcomponent type
    parameters
    subcomponent parameters
    constraints
  state:
    position
  output:
    3D mesh object
      onHover: shows parameters hierarchily
      onClick: allows users to edit parameters of subcomponent
*/

import React, {Component} from 'react'
import React3 from 'react-three-renderer';

var name2ReactThreeClass = {

}

export default Subcomponent extends Component {
  constructor(params) {
    super(props);

    // passed down from Component so that Subcomponents can
    // add itself to the subcomponent list.
    this.addSubcomponent = props.addSubcomponent;
    this.name = props.name;

    this.state = {

      //position??
    }
  }

  getComponent() {
    // async call
  }

  componentDidMount() {
    this.getComponent()
      .then((resp) => {
        resp = JSON.parse(resp).response;
        
      })
  }


}
