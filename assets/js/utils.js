import * as THREE from 'three'
function getLeftPos(el) {
  for (var leftPos = 0; el != null; leftPos+=el.offsetLeft, el=el.offsetParent);
  return leftPos;
}

function evalPrefix(eq, map) {
    if(eq === undefined)
        return undefined;
    var curr = new Equation();
    if(isOperator(eq[0]))
    {
        var left, right;
        if(eq.length > 3){
            left = evalPrefix(eq[1], map);
            var extra = [];
            extra.push(eq[0]);
            extra = extra.concat(eq.slice(2, eq.length));
            right = evalPrefix(extra, map);
        }
	    else if(eq.length == 2){
	        left = new Equation();
	        left.value = 0;
	        right = evalPrefix(eq[1],map);
	    }
	    else{
	        left = evalPrefix(eq[1],map);
	        right = evalPrefix(eq[2],map);
	    }
	    curr.build(left,right,eq[0]);
    }
    else if(eq == "pi")
    {
        curr.value = Math.PI;
    }
    else if(eq in map)
    {
      curr.name = eq;
	    curr.value = map[eq];
	    curr.derivatives[eq] = 1;
    }
    else if(!isNaN(eq))
    {
        if(Number(eq) < 0) {
            left = new Equation();
            left.value = 0;
            right = evalPrefix(-1*Number(eq), map);
            curr.build(left, right, "-");
        }
        else {
            curr.value = Number(eq);
        }
    }
    else {
        var operand = evalPrefix(eq[1],map);
        curr.functionBuild(eq[0],operand);
    }
    return curr;
}

function createMeshFromObject(obj)
{
    var material = new THREE.MeshPhongMaterial( { color:0xffffff, shading: THREE.FlatShading } );
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
    mesh["solved"] = obj["solved"];
    mesh["faces"] = obj["faces"];
    mesh["edges"] = obj["edges"];
    return mesh;
}

function highlightInterfaces(objMesh) {
    for(var i in objMesh.interfaceEdges) {
        if(objMesh.connectedInterfaces[i] == undefined){
            for(var j = 0, len = objMesh.interfaceEdges[i].length; j < len; j++) {
                if(objMesh.interfaceEdges[i][j] == null)
                    continue;
                var material = new THREE.LineBasicMaterial({
                    color: 0xff0000
                    });
                var geometry = new THREE.Geometry();
                var k = objMesh.interfaceEdges[i][j];
                var p1 = [], p2 = [];
                for(var p = 0; p < 2; p++){
                    for(var c = 0; c < 3; c++){
                    //objMesh["edges"][k][p][c] = objMesh["edges"][k][p][c]
                    //objMesh["edges"][k][p][c] = objMesh["edges"][k][p][c].replaceAll("**","^").replaceAll("[", "(").replaceAll("]", ")");
                    //.replaceAll("**","^");
                    if(p == 0)
                        p1.push(evalPrefix(objMesh["edges"][k][p][c],objMesh["solved"]).value);
                    else
                        p2.push(evalPrefix(objMesh["edges"][k][p][c],objMesh["solved"]).value);
                    }
                }
                geometry.vertices.push(
                               new THREE.Vector3( p1[0], p1[1], p1[2] ),
                               new THREE.Vector3( p2[0], p2[1], p2[2] )
                               );
                var line = new THREE.Line( geometry, material );
                line.name = i;
                objMesh.add(line);
            }
        }
    }
}

function loadSymbolic(that, obj, n) {
  var objMesh = createMeshFromObject(obj);

  objMesh.name = n;
  objMesh.className = that.componentName;
  objMesh.interfaces = {};
  objMesh.interfaceEdges = obj["interfaceEdges"];
  objMesh.connectedInterfaces = {};
  objMesh.parameterfuncs = {};
  highlightInterfaces(objMesh);
  // this.comp.subcomponents[objMesh.name] = this.comp.subcomponents.addFolder(objMesh.name);
  // var constrs = this.comp.subcomponents[objMesh.name].addFolder("Constrain Parameters");
  objMesh.parameters = obj['parameters'];
  // for(var pars in objMesh.parameters){
  //     var constraintButton = {
  //         mechInterface: undefined,
  //         controller: undefined,
  //         c: pars,
  //         constrain:function(){
  //             console.log(this.mechInterface.parameters);
  //             var value = window.prompt("Set " + objMesh.name + "_" + this.c + " to: ");
  //             constrainParameter(this.mechInterface.id, objMesh.name, this.c, value);
  //             this.controller.name(this.c + " = " + value);
  //         }
  //     }
  //     constraintButton.mechInterface = this;
  //
  //     var controller = constrs.add(constraintButton, "constrain");
  //     constraintButton.controller = controller;
  //     controller.name(pars);
  // }

  return objMesh;
}


export {getLeftPos, createMeshFromObject, loadSymbolic}
