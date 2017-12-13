import React, { Component } from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import ReactDOM from 'react-dom';
import MouseInput from './MouseInput'
// import TransformControls from 'three-transform-controls'
import ComponentList from './componentList'
import Popup from './popup'
// import PopUpList from './popupList'
import {getLeftPos, loadSymbolic} from './utils'
import { Manager, Target, Popper, Arrow } from 'react-popper'
import PopUp from './popup'
import NavBar from './navBar'

var OrbitControls = require('three-orbit-controls')(THREE)
var TransformControls = require('./TransformControls')(THREE);
// var TransformControls = TransformControls(THREE);

/* MechanicalInterface
  set up the interface for mechanical designs
*/


var testScObj = {
  name: 'testSC',
  parameters: ['r', 'w'],
  solved: {'r': 50, 'w': 100}
};
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

function shallowEqual(objA: mixed, objB: mixed): boolean {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  var bHasOwnProperty = hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}

function shallowCompare(instance, nextProps, nextState) {
  return (
    !shallowEqual(instance.props, nextProps) ||
    !shallowEqual(instance.state, nextState)
  );
}

class MechanicalInterface extends React.Component {
  constructor(props) {
    super(props);

    this.componentName = props.testData.componentName;
    this.id = props.testData.id;

    // this.cameraPosition = new THREE.Vector3(0, 0, 5);

    this.cameraPosition = new THREE.Vector3( 1000, 500, 1000);
    this.raycaster = new THREE.Raycaster();
    this.directionalLightPosition = new THREE.Vector3(50, 200, 100).multiplyScalar(1.3);
    this.normalizeMouse = new THREE.Vector2();
    this.mouse = new THREE.Vector2();
    this.state = {
      cubeRotation: new THREE.Euler(),
      subcomponents: [],
      loading: false,
      componentList: undefined,
      containerWidth: 1000,
      containerHeight: 565,
      ambientLightColor: '666666',
      directionalLightColor: 'dfebff',
      material: {
        color: "#1300FF",
        transparent: true,
        depthWrite: false
      },
      hover: undefined,
      clicked: undefined,
      parameters: props.testData.parameters,
      cubeRotation: new THREE.Euler(),

    };

    this._onAnimate = () => {
      // we will get this callback every frame
    };
  }

  loadComponentList() {
    return new Promise((resolve, reject) => {
      getComponentList("", (resp) => {
        if (resp != undefined)
          return resolve(JSON.parse(resp).response);
        return reject("error has occured when loading componentList");
      })
      //...
    })
  }


  // add subcomponent function passed down to each subcomponent to add itself to the
  // list of subcomponents of the component.
  addSc(scType) {
    var scName = window.prompt("Name for new " + scType);

    addSubcomponent(0, scName, scType, (resp) => {
      resp = JSON.parse(resp).response;
      // arrow function implicitly binds this!
      // console.log('resp', resp)
      // var objMesh = createMeshFromObject(resp);
      //
      // // var object = new THREE.Object3D();
      // this.control.attach(objMesh);
      // // object.add(objMesh);
      //

      var objMesh = loadSymbolic(this, resp, scName);
      // console.log('objMesh: ', instanceof(objMesh));
       console.log('objMesh', objMesh);
      this.refs.scene.add(objMesh);
      this.setState({
        subcomponents: this.state.subcomponents.concat([objMesh])
      });
      // console.log('newState', this.state.subcomponents);
      // this.forceUpdate();
    })
  }
  // fetch componentList and render to left-panel asynchronously
  componentWillMount() {
    this.setState({loading: true});
    this.loadComponentList()
      .then((data) => {
        this.setState({
          componentList: data,
          loading: false
        });
      });
  }

  componentDidMount() {
      // var material = new THREE.MeshBasicMaterial();
      // var object = new THREE.Object3D();
      // var plane = new THREE.Mesh(new THREE.PlaneGeometry(25, 5));

      const orbit = new OrbitControls(this.refs.camera, ReactDOM.findDOMNode(this.refs.react3));
      orbit.addEventListener('change', this.render);
      this.orbit = orbit;

      const control = new TransformControls(this.refs.camera, ReactDOM.findDOMNode(this.refs.react3));

      control.addEventListener('change', this.render);
      this.control = control;
    }

  componentWillUnmount() {
        this.controls.dispose();
        delete this.controls;
  }

  shouldComponentUpdate(nextProps, nextState) {
   return shallowCompare(this, nextProps, nextState);
  }

  _onMouseMove(e) {
    e.preventDefault();
    /*
    Temporary fixes:
    y coordinate of popups not showing properly on chrome
    */
    var rightPanelEl = document.getElementById('right-panel')
    this.mouse.x = e.clientX - getLeftPos(rightPanelEl);
    this.mouse.y = e.clientY;
    this.normalizeMouse.x = (this.mouse.x / this.state.containerWidth)*2-1;
    this.normalizeMouse.y = -((this.mouse.y) / this.state.containerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.normalizeMouse, this.refs.camera );
    var intersects = this.raycaster.intersectObjects(this.state.subcomponents,true);

    if (intersects.length>0) {
      this.setState({hover: intersects[0]})

    } else {
      this.setState({hover: undefined})
    }
  }

  _onClick(e) {
    // use raycaster to find the subcomponent clicked on
    e.preventDefault();


    // 2D coordinates of the mouse, in normalized device coordinates,
    // x and y components should be between -1 and 1
    // TODO: add offset when tab bar is added

    // console.log('right panel', getLeftPos(document.getElementById('right-panel')), document.getElementById('right-panel').clientWidth)

    this.raycaster.setFromCamera(this.normalizeMouse, this.refs.camera );
    var intersects = this.raycaster.intersectObjects(this.state.subcomponents,true);
    if (intersects.length>0) {
      var clickedMesh = intersects[0];
      this.setState({clicked: clickedMesh});
      console.log(this.control)
      console.log(clickedMesh)
      this.control.attach(clickedMesh.object);
      this.refs.scene.add(this.control);
    }


  }

  render() {
    const {
      ambientLightColor,
      directionalLightColor
    } = this.state;
    const width = this.state.containerWidth;
    const height = this.state.containerHeight;
    var subComponentGroup = (<group />);

    let clickedPopUp, hoverPopUp = null;

    if (this.state.clicked != undefined) {
      clickedPopUp = <Popup scObj={this.state.clicked.object} popupType='clicked' backgroundColor="#d3d3d3" compParams={this.state.parameters}/>
    }

    if (this.state.hover != undefined) {
      // console.log('render', popUp)
      hoverPopUp = <Popup scObj={this.state.hover.object} popupType='hover' backgroundColor="#d3d3d3" compParams={this.state.parameters}/>
    }

    //<PopUpList {...testData} />
    return (
      <div id='react-app' onClick={(e) => this._onClick(e)} onMouseMove={this._onMouseMove.bind(this)}>
         <div id="wrapper">
          <NavBar interfaces={['test']}/>
            { this.state.loading ? (<div>loading</div>) : <ComponentList componentList={this.state.componentList}
            addSubcomponent={this.addSc.bind(this)} />}
            <div id="page-content-wrapper">
              <div id="right-panel">
                <React3
                  mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
                  width={width}
                  height={height}
                  ref="react3"
                  onAnimate={this._onAnimate}
                  antialias
                  alpha={false}
                >
                  <scene ref="scene">
                    <perspectiveCamera
                      ref="camera"
                      name="camera"
                      fov={75}
                      aspect={width / height}
                      near={0.1}
                      far={100000}
                      position={this.cameraPosition}
                    />
                    <ambientLight color={Number.parseInt(ambientLightColor, 16)} />
                    <directionalLight
                      color={Number.parseInt(directionalLightColor, 16)}
                      position={this.directionalLightPosition}
                      intensity={1.75}
                    />

                    <group ref='group' />
                    <gridHelper
                      size={1000}
                      colorGrid={"#ffffff"}
                    />
                  </scene>
                </React3>
            </div>
            <Manager>
              <Target style={{position: 'absolute', top: this.mouse.y, left: this.mouse.x}}>
              </Target>
              <Popper> {hoverPopUp} </Popper>
              <Popper> {clickedPopUp} </Popper>
            </Manager>
            <div id="menu-toggle-button">
              <a href="#menu-toggle" className="btn btn-secondary" id="menu-toggle">Toggle Menu</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// return (<React3
//     mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
//     width={width}
//     height={height}
//     ref="react3"
//     onAnimate={this._onAnimate}
//     antialias
//     alpha={false}
//   >
//     <module
//       ref="mouseInput"
//       descriptor={MouseInput}
//     />
//
//     <scene>
//       <perspectiveCamera
//         ref="camera"
//         name="camera"
//         fov={75}
//         aspect={width / height}
//         near={0.1}
//         far={1000}
//         position={this.cameraPosition}
//       />
//
//       <group ref='group' />
//       <gridHelper
//         size={10}
//         colorGrid={"#040404"}
//       />
//
//       <mesh
//         rotation={this.state.cubeRotation}
//       >
//         <boxGeometry
//           width={1}
//           height={1}
//           depth={1}
//         />
//         <meshBasicMaterial
//           color={0x00ff00}
//         />
//       </mesh>
//
//
//     </scene>
//   </React3>
// )
ReactDOM.render(<MechanicalInterface testData={testData} />, document.getElementById("react-app"))
