import React from 'react';

console.log("hello")
class MechanicalInterface extends React.Component {
  constructor (name, tabDom, container, svgcontainer) {
    this.componentName = name;
    this.id = idGenerator++;
    this.container = container;
    this.svgcontainer = svgcontainer;
    this.tabDom = tabDom;
    this.scene = null;
    this.svgscene = null;
    this.camera = null;
    this.svgcamera = null;
    this.stl_loader = null;
    this.renderer = null;
    this.svgrenderer = null;
    this.control = null;
    this.orbit = null;
    this.gui = null;
    this.searchFilters = null;
    this.rightpanel = null;
    this.subprops = null;
    this.subcomponents = [];
    this.connectedSubcomponents = [];
    this.componentObj = null;
    this.componentLibrary = {};
    this.componentMenus = {};
    this.parameters = {};
    this.interfaces = {};
    this.connections = [];
    this.tempParams = {};
    this.componentCount = 0;
    this.comp = null;
    this.compName = null;
    this.componentsFolder = null;
    this.raycaster = new THREE.Raycaster();
    this.raycaster.linePrecision = 3;
    this.mouse = new THREE.Vector2();
    this.offset = new THREE.Vector3();
    this.SELECTED_2 = null;
    this.SELECTED = null;

    setInterval(this.blinker, 1500);
  }

  render() {
    var aspectratio = this.props.width / this.props.height;
    var cameraprops = {fov : 75, aspect : aspectratio,
                       near : 1, far : 5000,
                       position : new THREE.Vector3(0,0,600),
                       lookat : new THREE.Vector3(0,0,0)};

    return <Renderer width={this.props.width} height={this.props.height}>
        <Scene width={this.props.width} height={this.props.height} camera="maincamera">
            <PerspectiveCamera name="maincamera" {...cameraprops} />
            <Cupcake {...this.props.cupcakedata} />
        </Scene>
    </Renderer>;
  }
}

export {
  MechanicalInterface
}
