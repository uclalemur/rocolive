import React, { Component } from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import ReactDOM from 'react-dom';
// import MouseInput from './MouseInput'
import TransformControls from 'three-transform-controls'
import PopUpList from './popupList'
import {getLeftPos} from './utils'


var OrbitControls = require('three-orbit-controls')(THREE)
var tc = TransformControls(THREE);

/* MechanicalInterface
  set up the interface for mechanical designs
*/

var testData = {
  componentName: 'testInterface',
  id: 0,
  parameters: {
    'l': 50,
    'w': 400
  },
  subcomponents: [
    {
      'scname': 'r1',
      'scparams': {'l': 'l', 'w': 50},
      'paramUsed': ['l']
    },
    {
      scname: 't1',
      'scparams': {'e1': 30, 'e2': 40, 'e3': 50},
      'paramUsed': []
    }
  ],
}

class MechanicalInterface extends React.Component {
  constructor(props) {
    super(props);

    var {
      componentName,
      id,
      parameters,
      // subcomponents
    } = this.props;

    this.cameraPosition = new THREE.Vector3(0, 0, 5);
    this.raycaster = new THREE.Raycaster();

    this.state = {
      cubeRotation: new THREE.Euler(),
      subcomponents: []
    };

    this._onAnimate = () => {
      // we will get this callback every frame
    };
  }

  componentDidMount() {
    var material = new THREE.MeshBasicMaterial({
      color: "#1300FF",
      transparent: true,
      depthWrite: false
    });

    var object = new THREE.Object3D();
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(25, 5), material);
    var control = new tc(this.refs.camera, ReactDOM.findDOMNode(this.refs.react3));
    //explicitly bind object reference
    control.addEventListener('change', this.render.bind(this));
    control.attach( plane);
    object.add(control);
    object.add(plane);

    this.setState({
      subcomponents: this.state.subcomponents.concat([object, plane])
    });

    const controls = new OrbitControls(this.refs.camera);
    this.controls = controls;
    this.refs.group.add(object);
  }

  componentWillUnmount() {
        this.controls.dispose();
        delete this.controls;
  }

  onClick(e) {
    // use raycaster to find the subcomponent clicked on
    e.preventDefault();
    console.log(e.clientX);

    // 2D coordinates of the mouse, in normalized device coordinates,
    // x and y components should be between -1 and 1
    // TODO: add offset when tab bar is added
    var coords = {}
    // console.log('right panel', getLeftPos(document.getElementById('right-panel')), document.getElementById('right-panel').clientWidth)
    var rightPanelEl = document.getElementById('right-panel')
    coords.x = ((e.clientX - getLeftPos(rightPanelEl)) / rightPanelEl.clientWidth)*2-1;
    coords.y = -(e.clientY / rightPanelEl.clientHeight) * 2 + 1;
    console.log('coords', coords);
    console.log(this.refs.camera);
    this.raycaster.setFromCamera(coords, this.refs.camera );
    var intersects = this.raycaster.intersectObjects( this.state.subcomponents,true );
    console.log(intersects)
  }



  render() {
    const width = 1000; // canvas width
    const height = 800; // canvas height

    return (
      <div id='react-app' onClick={(e) => this.onClick(e)}>
        <PopUpList {...testData} />
        <div className="col-md-9" id="right-panel">
          <div className="row">

            <React3
              mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
              width={width}
              height={height}
              ref="react3"
              onAnimate={this._onAnimate}
              antialias
              alpha={false}
            >
              <scene>
                <perspectiveCamera
                  ref="camera"
                  name="camera"
                  fov={75}
                  aspect={width / height}
                  near={0.1}
                  far={1000}
                  position={this.cameraPosition}
                />

                <group ref='group' />
                <gridHelper
                  size={10}
                  colorGrid={"#040404"}
                />
                <mesh
                  rotation={this.state.cubeRotation}
                  name="cube"
                >
                  <boxGeometry
                    width={1}
                    height={1}
                    depth={1}
                  />
                  <meshBasicMaterial
                    color={0x00ff00}
                  />
                </mesh>
              </scene>
            </React3>
          </div>
        </div>
      </div>
    )
  }
}

// <module
//   ref="mouseInput"
//   descriptor={MouseInput}
// />

ReactDOM.render(<MechanicalInterface testData={testData} />, document.getElementById("react-app"))
