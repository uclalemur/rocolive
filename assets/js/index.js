import React, { Component } from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import ReactDOM from 'react-dom';
// import MouseInput from './MouseInput'
import TransformControls from 'three-transform-controls'
import PopUpList from './popupList'


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

    this.state = {
      cubeRotation: new THREE.Euler(),
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
    // explicitly bind object reference
    // control.addEventListener('change', this.render.bind(this));
    // control.attach( plane);
    object.add(control);
    object.add(plane);

    // const controls = new OrbitControls(this.refs.camera);
    // this.controls = controls;
    this.refs.group.add(object);
  }

  componentWillUnmount() {
    //     this.controls.dispose();
    //     delete this.controls;
  }

  render() {
    const width = 1000; // canvas width
    const height = 800; // canvas height

    return (
      <div id='react-app'>
        <PopUpList {...testData} />
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

              pointerEvents={['onClick']}
            />

            <group ref='group' />
            <gridHelper
              size={10}
              colorGrid={"#040404"}
            />

            <mesh
              rotation={this.state.cubeRotation}
              onClick3D={(e) => console.log('onClick') }
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
    )
  }
}

// <module
//   ref="mouseInput"
//   descriptor={MouseInput}
// />

ReactDOM.render(<MechanicalInterface testData={testData} />, document.getElementById("left-panel"))
