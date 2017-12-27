import React from 'react'
import * as THREE from 'three'
import {highlightInterfaces} from './utils'

export default class Roco3DComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mesh: undefined
    }

    this.loadSymbolic = this.loadSymbolic.bind(this);
  }

  // componentDidMount() {
  //   // add subcomponent's mesh onto the 3D view
  //   this.props.addToScene(this.mesh)
  // }
  //
  // componentWillUnmount() {
  //   this.props.removeFromScene(this.mesh);
  // }

  createMeshFromObject(obj) {
    var material = new THREE.MeshPhongMaterial( { color:0x33b5e5, shading: THREE.FlatShading } );
    var geometry = new THREE.Geometry();
    for(var face in obj["faces"]){
        var transf = new THREE.Matrix4();
        //obj["faces"][face][0] = obj["faces"][face][0].map(function(i){return i.replaceAll("**","^").replaceAll("[","(").replaceAll("]",")")})
        transf.elements = obj["faces"][face][0].map(function(i) {
          return evalPrefix(i,obj["solved"]).value
        });

        transf.transpose();
        var vertices = [];
        var set = new Set();
        var holes = [];
        for(var v = 0, len = obj["faces"][face][1]["vertices"].length; v < len; v++){
            try{
            //obj["faces"][face][1]["vertices"][v] = obj["faces"][face][1]["vertices"][v].map(function(i){if(typeof i == 'string' || i instanceof String)return i.replaceAll("**","^").replaceAll("[","(").replaceAll("]",")"); else return i;});
            } catch (err){console.log(face + " " +v);}
            var arr = obj["faces"][face][1]["vertices"][v].map(function(i){return evalPrefix(i,obj["solved"]).value});
            set.add(arr[0] + ","+arr[1]);
        }
        if(set.size < 3)
            continue;
        var iter = set.values();
        while(1){
            var element = iter.next();
            if(element["done"] == true)
            break;
            var period = element["value"].indexOf(",");
            vertices.push(new THREE.Vector3(Number(element["value"].substring(0,period)),Number(element["value"].substring(period+1)),0));
        }
        var numverts = geometry.vertices.length;
        var triangles = THREE.ShapeUtils.triangulateShape( vertices, holes );
        for(var v = 0, len = vertices.length; v < len; v++){
            var vert = new THREE.Vector4(vertices[v].x,vertices[v].y,0,1);
            vert.applyMatrix4(transf);
            vertices[v].x = vert.x; vertices[v].y = vert.y; vertices[v].z = vert.z;
        }
        geometry.vertices = geometry.vertices.concat(vertices);
        for(var t = 0, len = triangles.length; t < len; t++){
            geometry.faces.push(new THREE.Face3(triangles[t][0]+numverts, triangles[t][1]+numverts, triangles[t][2]+numverts));
        }
    }
    var mesh = new THREE.Mesh( geometry, material );
    mesh["parameters"] = obj["parameters"];
    mesh["solved"] = obj["solved"];
    mesh["faces"] = obj["faces"];
    mesh["edges"] = obj["edges"];
    return mesh;
  }

  loadSymbolic(obj) {
    var objMesh = this.createMeshFromObject(obj);

    objMesh.name = this.props.name
    objMesh.className = this.props.componentName;
    objMesh.interfaces = {};
    objMesh.interfaceEdges = obj["interfaceEdges"];
    objMesh.connectedInterfaces = {};
    objMesh.parameterfuncs = {};
    highlightInterfaces(objMesh);

    objMesh.parameters = obj['parameters'];

    return objMesh
  }

  componentDidMount() {
    this.setState({mesh: this.loadSymbolic(this.props.obj)})

    console.log('3D componnet', this.state)

  }

  render() {
    const {
      obj
    } = this.props;

    if (this.state.mesh != undefined) {
    console.log('mesh', this.state.mesh.geometry.vertices)
    console.log('color', this.state.mesh.material.color)
    console.log('shading', this.state.mesh.material.shading)
  }
    return (
      (this.state.mesh != undefined) ? <mesh>
        <geometry vertices={this.state.mesh.geometry.vertices} />
        <meshPhongMaterial color={this.state.mesh.material.color}
                            shading={this.state.mesh.material.shading}/>
      </mesh> : null
    )
  }
}
