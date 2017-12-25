import React, { Component } from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import ReactDOM from 'react-dom';
import MouseInput from './MouseInput'
// import TransformControls from 'three-transform-controls'
import ComponentList from './componentList'
import Popup from './popup'
// import PopUpList from './popupList'
import {getLeftPos, createMeshFromObject, highlightInterfaces, loadSymbolic, updateComponent, stripObjects} from './utils'
import { Manager, Target, Popper, Arrow } from 'react-popper'
import PopUp from './popup'
import NavBar from './navBar'
import ListOfThings from './listOfThings'
import {BuilderFileController} from './builderFiles/builderFile'
import _ from 'lodash'

var OrbitControls = require('three-orbit-controls')(THREE)
var TransformControls = require('./TransformControls')(THREE);

/* MechanicalInterface
  set up the interface for mechanical designs
*/

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

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

var popUpProps = {
  popupClass: 'popup',
  backgroundColor: "#d3d3d3"
}

// available function signatures
var functionSignatures = {
  addSubcomponent: '_addSc(scName, scType, record)',
  addComponentConnection: '_addComponentConnection(id, sc1, port1, sc2, port2, angle, record)',
  constrainParameter: '_constrainParameter(id, scName, parameter, constraint, record)'
}
class MechanicalInterface extends React.Component {
  constructor(props) {
    super(props);
    this.compId = 0;
    this.state = {
      cubeRotation: new THREE.Euler(),
      loading: false,
      componentList: undefined,
      containerWidth: window.innerWidth,
      containerHeight: window.innerHeight,
      ambientLightColor: '666666',
      directionalLightColor: 'dfebff',
      material: {
        color: "#1300FF",
        transparent: true,
        depthWrite: false
      },
      componentName: props.testData.componentName,
      parameters: props.testData.parameters,
      cubeRotation: new THREE.Euler(),
      selected: undefined,
      selected2: undefined,
      popupList: [],
      hover: undefined,
      connections: [],
      connectedSubcomponents: [],
      subcomponents: {
        count: {
          'Rectangle': 0,
          'Triangle': 0,
          'Connections': 0
        }
      },
      builtSubcomponents: {},
      componentObj: null,
      svg: {__html: '<svg width="100%" height="40%"></svg>'}
    };

    // this.cameraPosition = new THREE.Vector3(0, 0, 5);

    this.cameraPosition = new THREE.Vector3( 1000, 500, 1000);
    this.raycaster = new THREE.Raycaster();
    this.directionalLightPosition = new THREE.Vector3(50, 200, 100).multiplyScalar(1.3);
    this.normalizeMouse = new THREE.Vector2();
    this.mouse = new THREE.Vector2();


    this._onAnimate = () => {
      // we will get this callback every frame
    };

    this.addConnection = this.addConnection.bind(this);
    this.removePopUp = this.removePopUp.bind(this);

    this._addSc = this._addSc.bind(this);
    this._addComponentConnection = this._addComponentConnection.bind(this);
    this._constrainParameter = this._constrainParameter.bind(this);
    this.subcomponentList = this.subcomponentList.bind(this);

    this.builderFileController = new BuilderFileController(this.compId, "test")
  }

  // splitComponent() {
  //     this.refs.scene.remove(this.state.componentObj);
  //     delete this.state.componentObj;
  //     this.setState({componentObj: undefined});
  //     while(this.state.connectedSubcomponents.length > 0) {
  //       this.refs.scene.add(this.state.connectedSubcomponents[this.state.connectedSubcomponents.length-1]);
  //       let componentToSplit = this.state.connectedSubcomponents[this.state.connectedSubcomponents.length-1]
  //       this.setState({subcomponents: [...this.state.subcomponents, componentToSplit]});
  //       this.setState({connectedSubComponents: this.state.connectedSubcomponents.slice(0, this.state.connectedSubcomponents.length-2)})
  //     }
  // }

  subcomponentList() {
    return Object.keys(this.state.subcomponents).map((key) => this.state.subcomponents[key].mesh);
  }

  loadComponentList() {
    return new Promise((resolve, reject) => {
      getComponentList("", (resp) => {
        if (resp != undefined)
          return resolve(JSON.parse(resp).response);
        return reject("error has occured when loading componentList");
      })
    })
  }

  // add subcomponent function passed down to each subcomponent to add itself to the
  // list of subcomponents of the component.
  _addSc(scName, scType, record) {
    addSubcomponent(0, scName, scType, (resp) => {
      // arrow function implicitly binds this!
      resp = JSON.parse(resp).response;

      var objMesh = loadSymbolic(this, resp, scName);

      this.refs.scene.add(objMesh);

      var newSubcomponents = Object.assign({}, this.state.subcomponents);
      var newSubcomponent = {}
      newSubcomponent.mesh = objMesh;
      for (var param in resp.solved)
        newSubcomponent[param] = resp.solved[param]
      newSubcomponents[scName] = newSubcomponent
      this.setState({
        subcomponents: newSubcomponents
      });

      // add to builderFileController buffer
      if (record) {
        let instruction = functionSignatures.addSubcomponent.replace('scName', scName).replace('scType', scType);
        this.builderFileController.addToBuffer(instruction);
      }

      console.log('state after add sc:', this.state)
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
      createComponent(this.compId);
      // var material = new THREE.MeshBasicMaterial();
      // var object = new THREE.Object3D();
      // var plane = new THREE.Mesh(new THREE.PlaneGeometry(25, 5));

      const orbit = new OrbitControls(this.refs.camera, ReactDOM.findDOMNode(this.refs.react3));
      orbit.addEventListener('change', () => this.render);
      this.orbit = orbit;

      const control = new TransformControls(this.refs.camera, ReactDOM.findDOMNode(this.refs.react3));

      control.addEventListener('change', () => this.render);
      this.control = control;
    }

  componentWillUnmount() {
      // this.control.dispose();
      // delete this.control;

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
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    this.normalizeMouse.x = (this.mouse.x / this.state.containerWidth)*2-1;
    this.normalizeMouse.y = -((this.mouse.y) / this.state.containerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.normalizeMouse, this.refs.camera );
    var objs = this.subcomponentList();

    if(this.state.componentObj != undefined)
      objs = objs.concat(this.state.componentObj);
    var intersects = this.raycaster.intersectObjects(objs,true);

    if (intersects.length>0) {
      this.setState({hover: intersects[0]})

    } else {
      this.setState({hover: undefined})
    }
  }

  _onClick(event) {
    // use raycaster to find the subcomponent clicked on
    event.preventDefault();

    // 2D coordinates of the mouse, in normalized device coordinates,
    // x and y components should be between -1 and 1
    // TODO: add offset when tab bar is added

    // console.log('right panel', getLeftPos(document.getElementById('right-panel')), document.getElementById('right-panel').clientWidth)
    this.raycaster.setFromCamera(this.normalizeMouse, this.refs.camera );
    var objs = this.subcomponentList();
    if(this.state.componentObj != undefined)
        objs = objs.concat(this.state.componentObj);

    var intersects = this.raycaster.intersectObjects(objs,true);
    var obj;
    if(!event.shiftKey)
        obj = this.state.selected;
    else
        obj = this.state.selected2;

    if (intersects.length>0) {
      console.log('intersect', intersects[0])

      console.log('OBJ', obj)
      if(obj != undefined && obj.parent.type != "Scene") {
          obj.material.color = new THREE.Color(0xff0000);
          if(!event.shiftKey) {
              this.setState({selected: undefined});
            }
          else {
              this.setState({selected2: undefined});
            }
      }

      var clickedMesh = intersects[0];

      if(clickedMesh.object.parent != null && clickedMesh.object.parent.type != "Scene"){
          clickedMesh.object.material.color = new THREE.Color(0x00ff00);
          if(!event.shiftKey){
              if(this.state.selected != undefined && this.state.selected.parent.type == "Scene")
                  this.control.detach(this.state.selected);
              this.setState({selected: clickedMesh.object}, () => {
              })
          }
          else {
            this.setState({selected2: clickedMesh.object}, () => {
              this.addConnection();
            })
          }
      }
      else {
        this.control.attach(clickedMesh.object);
        this.refs.scene.add(this.control);
        // double click
        if(!event.shiftKey){
          if (clickedMesh.object == this.state.selected) {
            this.setState({popupList: [...this.state.popupList, clickedMesh]});
          }
          this.setState({selected: clickedMesh.object}, () => {
            // console.log('selected', this.state.selected, this.state.selected2)
          });
        }
      }
    }
  }

  buildComponent() {
    let thisComponent = {};
    thisComponent.name = this.state.componentName;
    thisComponent.subcomponents = [];
    stripObjects(this.subcomponentList(),thisComponent.subcomponents);
    stripObjects(this.state.connectedSubcomponents,thisComponent.subcomponents);
    thisComponent.parameters = this.state.parameters;
    thisComponent.connections = this.state.connections;

    makeComponent(this.compId, (response) => {
      response = JSON.parse(response).response;
      console.log('response', response)

      if(this.state.selected != undefined){
          this.control.detach(this.state.selected);
          this.setState({selected: undefined});
      }

      // remove previous subcomponents
      let copySubcomponents = this.subcomponentList();
      let copyConnectedSubcomponents = this.state.connectedSubcomponents;

      for(var i = 0, len = copyConnectedSubcomponents.length;i < len; i++)
          copyConnectedSubcomponents[i] = updateComponent(copyConnectedSubcomponents[i],response);
      while(copySubcomponents.length > 0){
          this.refs.scene.remove(copySubcomponents[copySubcomponents.length-1]);
          copySubcomponents[copySubcomponents.length-1] = updateComponent(copySubcomponents[copySubcomponents.length-1],response);
          copyConnectedSubcomponents.push(copySubcomponents[copySubcomponents.length-1]);
          copySubcomponents.splice(copySubcomponents.length-1,1);
      }

      // load newly built component
      this.onComponentSymbolic(response)
      this.viewSVG();

      // this.builderFileController.flush((err) => {
      //   if (err) throw err;
      //   console.log('The file has been saved!');
      // });
      console.log('HERE')
      var updatedSubcomponents = Object.assign({}, this.state.subcomponents, this.state.builtSubcomponents);
      Object.keys(response.solved).map((key) => {
        let scParam = key.split('_')
        let sc = scParam[0]
        let param = scParam[1]

        updatedSubcomponents[sc][param] = response.solved[key]
      })

      this.setState({
        builtSubcomponents: Object.assign({}, updatedSubcomponents),
        subcomponents: {}
      }, () => {
        console.log('state after build sc:', this.state)
      });
    })
  }

  onComponentSymbolic(obj) {
      if(this.state.componentObj)
          this.refs.scene.remove(this.state.componentObj);
          //.replaceAll("**","^");

      let componentObj = createMeshFromObject(obj);
      console.log('onComponentSymbolic', componentObj)
      componentObj.type = "MasterComponent";
      componentObj.interfaceEdges = obj["interfaceEdges"]
      componentObj.connectedInterfaces = {};
      for(var i = 0, len = this.state.connectedSubcomponents.length; i < len; i++) {
          for(var interfaceEdge in this.state.connectedSubcomponents[i].interfaceEdges) {
              obj.interfaceEdges[this.state.connectedSubcomponents[i].name + "_" + interfaceEdge] = []
              for(var edge = 0, edges = this.state.connectedSubcomponents[i].interfaceEdges[interfaceEdge].length; edge < edges; edge++) {
                  obj.interfaceEdges[this.state.connectedSubcomponents[i].name + "_" + interfaceEdge].push(this.state.connectedSubcomponents[i].name + "_" + this.state.connectedSubcomponents[i].interfaceEdges[interfaceEdge][edge]);
              }
          }
      }

      for(var i = 0, len = this.state.connections.length; i < len; i++) {
          componentObj.connectedInterfaces[this.state.connections[i].interface1.replaceAll(".", "_")] = true;
          componentObj.connectedInterfaces[this.state.connections[i].interface2.replaceAll(".", "_")] = true;
      }

      highlightInterfaces(componentObj);
      componentObj.name=Object.keys(this.state.subcomponents).join('+')
      this.setState({componentObj: componentObj});

      this.refs.scene.add(componentObj);
  }

  addParameter() {

  }

  delParameter() {

  }

  addConnection() {
    if(this.state.selected != undefined && this.state.selected2 != undefined && this.state.selected.parent != "Scene" && this.state.selected2.parent != "Scene") {
        var newConn = {};
        newConn.name = window.prompt("Connection Name: ");
        if(newConn.name == "" || newConn.name == null)
            return;
        for(var iter = 0, len = this.state.connections.length; iter < len; iter++){
            if(this.state.connections[iter].name == newConn.name){
            window.alert('Connection with name "' + newConn.name + '" already exists');
            return;
            }
        }
        var angle = window.prompt("Connection Angle: ");
        if(angle == "" || angle == null || isNaN(angle))
            return;
        var s1pname, s1name, s2pname, s2name;
        if(this.state.selected.parent.type == "MasterComponent"){
            newConn.interface1 = this.state.selected.name.replaceAll("_", ".");
            var spl = this.state.selected.name.split("_");
            s1pname = spl[0];
            s1name = spl[1];
        }
        else {
            newConn.interface1 = this.state.selected.parent.name + "." + this.state.selected.name;
            s1pname = this.state.selected.parent.name;
            s1name = this.state.selected.name;
        }
        if(this.state.selected2.parent.type == "MasterComponent") {
            newConn.interface2 = this.state.selected2.name.replaceAll("_", ".");
            var spl = this.state.selected2.name.split("_");
            s2pname = spl[0];
            s2name = spl[1];
        }
        else {
            newConn.interface2 = this.state.selected2.parent.name + "." + this.state.selected2.name;
            s2pname = this.state.selected2.parent.name;
            s2name = this.state.selected2.name;
        }

        this._addComponentConnection(this.compId, s1pname, s1name, s2pname, s2name, angle, true);
        this.setState({connections: [...this.state.connections, newConn]})
        let newSelected = _.extend({}, this.state.selected)
        let newSelected2 = _.extend({}, this.state.selected2)
        newSelected.parent.connectedInterfaces[this.state.selected.name] = newConn.interface2;
        newSelected2.parent.connectedInterfaces[this.state.selected2.name] = newConn.interface1;

        this.setState({
          selected: newSelected,
          selected2: newSelected2
        })
      }
  }

  _addComponentConnection(id, sc1, port1, sc2, port2, angle, record) {
    addComponentConnection(id,sc1,port1,sc2,port2, angle, (resp)=>{
      if (record) {
        let instruction = functionSignatures.addComponentConnection
          .replace('sc1', sc1).replace('port1', port1)
          .replace('sc2', sc2).replace('port2', port2)
          .replace('angle', angle)

        this.builderFileController.addToBuffer(instruction);
      }
    });
  }

  _constrainParameter(id, scName, keyVals, record) {
    Object.keys(keyVals).map((param, idx) => {

        setTimeout(() => {
          let constraint = keyVals[param]
          constrainParameter(id, scName, param, constraint, (resp) => {
          if (record) {
            let instruction = functionSignatures.constrainParameter
              .replace('scName', scName).replace('parameter', param)
              .replace('constraint', constraint);

            this.builderFileController.addToBuffer(instruction);
          }
        })}, idx*500);

        // TODO: why does this not work?
        // this.props.constrainParameter(compId, scObj.name, param, keyVals[param], true);
    });
  }

  delConnection() {

  }

  addInterface() {
    if(this.state.selected != undefined && this.state.selected.parent != "Scene")
    {
        var name = window.prompt("Name for inherited interface: ");
        if(name == "" || name == null)
            return;
        var s1pname, s1name;
        if(this.state.selected.parent.type == "MasterComponent"){
            var spl = this.state.selected.name.split("_");
            s1pname = spl[0];
            s1name = spl[1];
        }
        else {
            s1pname = this.state.selected.parent.name;
            s1name = this.state.selected.name;
        }
        let newInterfaces = _.extend({}, this.state.interfaces);
        newInterfaces[name] = s1pname + "." + s1name;
        this.setState({interfaces: newInterfaces});
        inheritInterface(this.compId,name, s1pname, s1name);
    }
  }

  delInterface() {

  }

  viewSVG() {
    getSVG(this.compId, (response) => {
       response = JSON.parse(response).response;
       this.setState({
         svg: {
           __html: response
         }
       })
     });
  }

  // passed down to popups so that they can remove themselves when
  // they are not needed
  removePopUp(scName) {
    // remove popup
    let newPopupList = this.state.popupList.filter((popup) => {
      return popup.object.name !=scName;
    })

    this.setState({popupList: newPopupList});
  }

  // _onKeyPress() {
  //   // TODO: add rotate mode
  // }

  render() {
    const width = this.state.containerWidth;
    const height = this.state.containerHeight;
    const ambientLightColor = this.state.ambientLightColor;
    const directionalLightColor = this.state.directionalLightColor;

    var subComponentGroup = (<group />);

    let clickedPopUps, hoverPopUp = null;

    if (this.state.hover != undefined) {
      hoverPopUp = <Popup scObj={this.state.hover.object} popupType='hover' compParams={this.state.parameters} {...popUpProps}
      {...this.props}/>
    }
    if (this.state.popupList.length != 0) {
      clickedPopUps = (
        this.state.popupList.map((popup) => {
          return (
            <Popup scObj={popup.object} popupType='clicked' compParams={this.state.parameters} {...popUpProps}
            popupStyle={{position: 'absolute', right: 100, top: 50}} removePopUp={this.removePopUp} compId={this.compId}
            constrainParameter={this._constrainParameter}/>
          )
        })
      )
    }

    return (
      <div id='react-app' onClick={(e) => this._onClick(e)} onMouseMove={this._onMouseMove.bind(this)}>
         <div id="wrapper">
            <div id="sidebar-container">
              { this.state.loading ? (<div>loading</div>) : <ComponentList
              addSc={(scName, scType) => {
                this._addSc(scName, scType, true);
              }} {...this.state} />}
            </div>
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
              <Target style={{position: 'absolute', top: this.mouse.y+10, left: this.mouse.x+10}}>
              </Target>
              <Popper> {hoverPopUp} </Popper>
            </Manager>
            <ListOfThings listType='stack' elementName='popup' elementClassName='card ui-widget-content'
              elementStyle={{width: 300, height: 100}} listClassName='clickedPopupGroup' container='div' >
              {clickedPopUps}
            </ListOfThings>
            <div id="menu-toggle-button">
              <a href="#menu-toggle" className="btn btn-secondary" id="menu-toggle"
                style={{position: 'fixed', bottom: 10, left:10}}>TM</a>
              <a href="#buildComponent" className="btn btn-secondary" id="menu-toggle"
                style={{position: 'fixed', bottom: 10, left:60}} onClick={()=>this.buildComponent()}>BC</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<MechanicalInterface testData={testData} />, document.getElementById("react-app"))
