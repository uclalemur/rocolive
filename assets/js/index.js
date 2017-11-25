import React, { Component } from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import ReactDOM from 'react-dom';
// import MouseInput from './MouseInput'
import TransformControls from 'three-transform-controls'
import ComponentList from './componentList'
// import PopUpList from './popupList'
import {getLeftPos, loadSymbolic} from './utils'


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

    this.componentName = props.testData.componentName;
    this.id = props.testData.id;
    this.parameters = props.testData.parameters;

    this.cameraPosition = new THREE.Vector3( 1000, 500, 1000);
    this.raycaster = new THREE.Raycaster();
    this.directionalLightPosition = new THREE.Vector3(50, 200, 100).multiplyScalar(1.3);
    this.mouse = new THREE.Vector2();
    this.state = {
      cubeRotation: new THREE.Euler(),
      subcomponents: [],
      loading: false,
      componentList: undefined,
      containerWidth: 1000,
      containerHeight: 800,
      ambientLightColor: '666666',
      directionalLightColor: 'dfebff',
      material: {
        color: "#1300FF",
        transparent: true,
        depthWrite: false
      }
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
      console.log('resp', resp)
      // arrow function implicitly binds this!
      // console.log('resp', resp)
      // var objMesh = createMeshFromObject(resp);
      //
      // // var object = new THREE.Object3D();
      // this.control.attach(objMesh);
      // // object.add(objMesh);
      //

      var objMesh = loadSymbolic(this, resp, scName);
      // console.log('objMesh', objMesh);
      this.refs.scene.add(objMesh);
      this.setState({
        subcomponents: this.state.subcomponents.concat([objMesh])
      });
      console.log('newState', this.state.subcomponents);
      this.forceUpdate();
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
    var material = new THREE.MeshBasicMaterial({
      color: "#1300FF",
      transparent: true,
      depthWrite: false
    });

    // this.object = new THREE.Object3D();
    // var plane = new THREE.Mesh(new THREE.PlaneGeometry(25, 5), material);
    this.control = new tc(this.refs.camera, ReactDOM.findDOMNode(this.refs.react3));
    //explicitly bind object reference
    this.control.addEventListener('change', this.render.bind(this));
    // this.control.attach( plane);
    // this.object.add(control);
    // object.add(plane);

    // this.setState({
    //   subcomponents: this.state.subcomponents.concat([this.object])
    // });

    const controls = new OrbitControls(this.refs.camera);
    this.controls = controls;
    // this.refs.group.add(this.object);

    console.log('orig scene', this.refs.scene);
  }

  componentWillUnmount() {
        this.controls.dispose();
        delete this.controls;
  }

  onClick(e) {
    // use raycaster to find the subcomponent clicked on
    e.preventDefault();
    var rightPanelEl = document.getElementById('right-panel')
    console.log("clicked at ", getLeftPos(rightPanelEl), e.clientY);


    // 2D coordinates of the mouse, in normalized device coordinates,
    // x and y components should be between -1 and 1
    // TODO: add offset when tab bar is added

    // console.log('right panel', getLeftPos(document.getElementById('right-panel')), document.getElementById('right-panel').clientWidth)


    this.mouse.x = ((e.clientX - getLeftPos(rightPanelEl)-15) / this.state.containerWidth)*2-1;
    this.mouse.y = -((e.clientY-20) / this.state.containerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.refs.camera );
    var intersects = this.raycaster.intersectObjects(this.state.subcomponents,true);
    console.log(intersects)
  }

  render() {
    const {
      ambientLightColor,
      directionalLightColor
    } = this.state;
    const width = this.state.containerWidth;
    const height = this.state.containerHeight;
    var subComponentGroup = (<group />);

    //<PopUpList {...testData} />
    return (
      <div id='react-app' onClick={(e) => this.onClick(e)}>
         <div id="wrapper">
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
              <a href="#menu-toggle" className="btn btn-secondary" id="menu-toggle">Toggle Menu</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

/*
{this.state.subcomponents.map((sc) => {
  return (<mesh>
    <geometry {...sc.geometry}/>
    <meshBasicMaterial {...this.state.material}/>
  </mesh>);
})}
*/
// <mesh
//   rotation={this.state.cubeRotation}
//   name="cube"
// >
//   <boxGeometry
//     width={1}
//     height={1}
//     depth={0}
//   />
//   <meshBasicMaterial
//     color={0x00ff00}
//   />
// </mesh>
// {this.state.subcomponents.map((sc) => {
//
// })}


//  <div className="col-md-9" id="right-panel">
  //   <div className="row">
  //
  //
  //   </div>
  // </div>
// <module
//   ref="mouseInput"
//   descriptor={MouseInput}
// />

ReactDOM.render(<MechanicalInterface testData={testData} />, document.getElementById("react-app"))
