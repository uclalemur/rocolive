import React from 'react'
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import ReactDOM from 'react-dom';
import {MechanicalInterface} from './mechDisplay'

// var TransformControls = require('./TransformControls')(THREE);

// // import PopupList from './popupList'

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popUpList: [],

      camera: {
        cameraPosition: new THREE.Vector3(0, 2, 5),
        cameraPerspective: new THREE.Vector3( 0, 0, 0 ),
      },
      // direction and ambient light colors
      lights: {
        dirLight1: {
          color: 0xffffff,
          position: new THREE.Vector3(1, 1, 1)
        },
        dirLight2: {
          color: 0x002288,
          position: new THREE.Vector3(-1, -1, -1)
        },
        ambientLightColor: 0x222222
      },
    };


    this.clientWidth = props.clientWidth;
    this.clientHeight = props.clientHeight;

    this.interfaceName = props.interfaceName;
    // camera position and perspective

    this.svgCameraPosition = new THREE.Vector3(0,0,0);
    // this.stl_loader = new THREE.STLLoader();
    this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    this.renderer.setSize(this.clientWidth, this.clientHeight);
    this.renderer.setClearColor( 0x000000,0);

  }

  componentDidMount() {
    var container = ReactDOM.findDOMNode(this.refs.container);
    var componentView = ReactDOM.findDOMNode(this.refs.componentView);
    var drawingView = ReactDOM.findDOMNode(this.refs.drawingView)
    console.log(componentView);
    this.mechDisplay = new MechanicalInterface('test', container.div, componentView, drawingView);
    this.mechDisplay.mechanicalGo();
    // console.log(this.refs.camera.constructor.name);
    // this.control = new THREE.TransformControls( this.refs.camera, ReactDOM.findDOMNode(this.refs.react3) );
    // this.orbit = new THREE.OrbitControls( this.refs.camera, ReactDOM.findDOMNode(this.refs.react3) );

    // this.control.addEventListener( 'change', this.render );
    // var object = new THREE.Object3D();
    // // attach transform control to the scene
    // var control = new TransformControls(this.refs.camera, ReactDOM.findDOMNode(this.refs.react3));
    //
    // object.add(control);
    // this.refs.group.add(object);
    console.log('here', this.mechDisplay);
  }

  render() {
    // if(this.control)
    //     this.control.update();
    // if(this.renderer)
    //     this.renderer.render( this.refs.scene, this.refs.camera );
    //
    // const width = 800; // canvas width
    // const height = 500; // canvas height
    //
    // var {
    //   cameraPosition,
    //   cameraPerspective
    // } = this.state.camera;
    //
    // var {
    //   dirLight1,
    //   dirLight2,
    //   ambientLightColor
    // } = this.state.lights;


    // console.log(dirLight1Color)

    return (
      <div ref="container" className="row">
        <div ref="componentView" className="componentView"></div>
        <div ref="drawingView" className="drawingView"></div>
      </div>
    );
  }
}

// <React3
//   mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
//   width={width}
//   height={height}
//   ref="react3"
// >
//   <scene ref="scene">
//       <transformControls />
//       <perspectiveCamera
//         name="camera"
//         fov={75}
//         aspect={width / height}
//         near={0.1}
//         far={1000}
//         ref="camera"
//
//         position={cameraPosition}
//         lookAt={cameraPerspective}
//       />
//       <group ref='group' />
//       <gridHelper size={(500, 100)} />
//       <directionalLight {...dirLight1} />
//       <directionalLight {...dirLight2} />
//       <ambientLight color={ambientLightColor}/>
//     </scene>
// </React3>





// import React from 'react';
// import React3 from 'react-three-renderer';
// import * as THREE from 'three';
// import ReactDOM from 'react-dom';
//
// export default class Simple extends React.Component {
//   constructor(props, context) {
//     super(props, context);
//
//     // construct the position vector here, because if we use 'new' within render,
//     // React will think that things have changed when they have not.
//     this.cameraPosition = new THREE.Vector3(0, 2, 5);
//
//     this.state = {
//       cubeRotation: new THREE.Euler(),
//     };
//
//     this._onAnimate = () => {
//       // we will get this callback every frame
//
//       // pretend cubeRotation is immutable.
//       // this helps with updates and pure rendering.
//       // React will be sure that the rotation has now updated.
//       this.setState({
//         cubeRotation: new THREE.Euler(
//           this.state.cubeRotation.x + 0.1,
//           this.state.cubeRotation.y + 0.1,
//           0
//         ),
//       });
//     };
//   }
//
//   render() {
//     const width = window.innerWidth; // canvas width
//     const height = window.innerHeight; // canvas height
//
//     return (<React3
//       mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
//       width={width}
//       height={height}
//
//       onAnimate={this._onAnimate}
//     >
//       <scene>
//         <perspectiveCamera
//           name="camera"
//           fov={75}
//           aspect={width / height}
//           near={0.1}
//           far={1000}
//
//           position={this.cameraPosition}
//         />
//         <mesh
//           rotation={this.state.cubeRotation}
//         >
//           <boxGeometry
//             width={1}
//             height={1}
//             depth={1}
//           />
//           <meshBasicMaterial
//             color={0x00ff00}
//           />
//         </mesh>
//         <gridHelper size={(500, 100)}/>
//       </scene>
//     </React3>);
//   }
// }
