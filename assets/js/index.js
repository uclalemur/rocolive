import ReactDOM from 'react-dom'
import React from 'react'
import {MechanicalInterface} from './app'

function App() {
  return (
    <div className="mech_wrapper">
      <div className="row content">
      	<div className="col-md-3">
      	  <div className="left-panel"></div>
      	</div>
      	<div className="col-md-6">
          <div className="row">
            <div id="popup_container"></div>
            <div className="componentView"></div>
            <div className="drawingView"></div>
          </div>
          // pass in interface name
          <MechanicalInterface name="testInterface" />
      	</div>
      	<div className="col-md-3">
      	  <div className="right-panel"></div>
      	</div>
      </div>
    </div>
  );
}


// <div className="row" height="45%" padding="2%" backgroundColor="white">
//
//   <div className="svg-view" width="100%" height="100%"></div>
//
// </div>
// <div className="row" style={{height: "5%"}}>
//   <center>
//     <button type="button" onClick="build()">Build Component</button>
//     <button type="button" className="fEdge" onClick="fixEdgeInterface()">Fix Interface</button>
//     <button type="button" className="dSVG" onClick="downloadSVG()" disabled>Download DXF</button>
//     <button type="button" className="sComp" onClick="saveComponent()" disabled>Save Component</button>
//     <button type="button" className="sComp" onClick="splitComponent()" disabled>Split Component</button>
//   </center>
// </div>
// console.log(document.getElementsByClassName("componentView"));
ReactDOM.render(<App />, document.getElementById("react-app"))
