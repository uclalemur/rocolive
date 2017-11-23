import React from 'react'
import ReactDOM from 'react-dom'
import MechanicalInterface from './mechanicalInterface'


var testProps = {
  width: 800,
  height: 500
}

var testTab;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    testTab = {
       name: 'testTab',
     }
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="mech_wrapper">
        <div className="row content">
        	<div className="col-md-3">
        	  <div className="left-panel"></div>
        	</div>
        	<div className="col-md-6">
            <MechanicalInterface {...testProps} />
        	</div>
        	<div className="col-md-3">
        	  <div className="right-panel"></div>
        	</div>
        </div>
      </div>
    );
  }
}
