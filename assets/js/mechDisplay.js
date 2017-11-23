var THREE = require('three')
var debugObj;
var idGenerator = 0;
// store the uuid of the last face whose parameters were displayed
var previousPopUpId;

class MechanicalInterface {
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

    mechanicalGo() {
        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.svgscene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, this.container.clientWidth / this.container.clientHeight, 0.1, 100000 );
        //camera = new THREE.OrthographicCamera(container.offsetWidth / -2, container.offsetWidth / 2, container.offsetHeight / 2, container.offsetHeight / -2, 0.1, 100000);
        this.svgcamera = new THREE.OrthographicCamera(this.svgcontainer.offsetWidth / -2, this.svgcontainer.offsetWidth / 2, this.svgcontainer.offsetHeight / 2, this.svgcontainer.offsetHeight / -2, 1, 1000);

        // this.stl_loader = new THREE.STLLoader();
        this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
        this.renderer.setSize( this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor( 0x000000,0);
        this.svgrenderer = new THREE.WebGLRenderer({alpha:true,antialias: true});
        this.svgrenderer.setSize(this.svgcontainer.clientWidth, this.svgcontainer.clientHeight);
        this.svgrenderer.setClearColor(0x000000,0);
        this.container.appendChild( this.renderer.domElement );
        this.svgcontainer.appendChild(this.svgrenderer.domElement);
        this.scene.add( new THREE.GridHelper( 500, 100 ) );
        this.camera.position.set( 1000, 500, 1000 );
        this.camera.lookAt( new THREE.Vector3( 0, 200, 0 ) );
        this.svgcamera.position.set(0,1000,0);
        this.svgcamera.lookAt(new THREE.Vector3(0,0,0));
        var light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 );
        this.scene.add( light );

        light = new THREE.DirectionalLight( 0x002288 );
        light.position.set( -1, -1, -1 );
        this.scene.add( light );

        light = new THREE.AmbientLight( 0x222222 );
        this.scene.add( light );

        this.control = new THREE.TransformControls( this.camera, this.renderer.domElement );
        this.control.addEventListener( 'change', this.render );
        this.orbit = new THREE.OrbitControls( this.camera, this.renderer.domElement );
        this.render();
        // this.loadGui();
        // this.getComponents();
        // createComponent(this.id);
        this.renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove(this), false );
        this.renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown(this), false );
        this.renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
    }

    // blinker() {
    //     $('.blink_me').fadeOut(750);
    //     $('.blink_me').fadeIn(750);
    // }
    //
    // downloadSVG() {
    //     var name = this.componentName + ".dxf";
    //     this.getSVGDownload(this.id, function(response){
    //         var data = JSON.parse(response).response;
    //         this.download(name, data)
    //     });
    // }

    // splitComponent() {
    //     this.scene.remove(this.componentObj);
    //     delete this.componentObj;
    //     this.componentObj = undefined;
    //     while(this.connectedSubcomponents.length > 0) {
	  //       this.scene.add(this.connectedSubcomponents[this.connectedSubcomponents.length-1]);
	  //       this.subcomponents.push(this.connectedSubcomponents[this.connectedSubcomponents.length-1]);
	  //       this.connectedSubcomponents.splice(this.connectedSubcomponents.length-1,1);
    //     }
    //     this.tabDom.getElementsByClassName("sComp")[0].disabled = true;
    // }
    //
    // downloadYaml() {
    //     var name = this.componentName + ".yaml"
    //     this.getYamlDownload(this.id, function(response){
    //         var data = JSON.parse(response).response;
    //         this.download(name, data);
    //     })
    // }

    saveComponent() {
        componentSave(this.id,this.componentName, function(){});
    }

    fixEdgeInterface() {
        var name, interfaceToFix, value;
        if(this.SELECTED != undefined && this.SELECTED.parent != "Scene") {
            if(this.SELECTED.parent.type == "MasterComponent") {
                var spl = this.SELECTED.name.split("_");
		        name = spl[0];
		        interfaceToFix = spl[1];
            }
            else {
                name = this.SELECTED.parent.name;
		        interfaceToFix = this.SELECTED.name;
            }
            var value = window.prompt("Value to fix interface to");
            this.fixComponentEdgeInterface(this.id,name, interfaceToFix, value);
        }
    }

    downloadModel() {
        if(UrlExists("models/" + this.componentName + "/graph-model.stl"))
	        window.open("models/" + this.componentName + "/graph-model.stl");
    }

    onComponentSymbolic(obj) {
        if(this.componentObj)
            this.scene.remove(this.componentObj);
            //.replaceAll("**","^");
        debugObj = obj;
        this.componentObj = createMeshFromObject(obj);
        this.componentObj.type = "MasterComponent";
        this.componentObj.interfaceEdges = obj["interfaceEdges"]
        this.componentObj.connectedInterfaces = {};
        for(var i = 0, len = this.connectedSubcomponents.length; i < len; i++) {
            for(var interfaceEdge in this.connectedSubcomponents[i].interfaceEdges) {
                obj.interfaceEdges[this.connectedSubcomponents[i].name + "_" + interfaceEdge] = []
                for(var edge = 0, edges = this.connectedSubcomponents[i].interfaceEdges[interfaceEdge].length; edge < edges; edge++) {
                    obj.interfaceEdges[this.connectedSubcomponents[i].name + "_" + interfaceEdge].push(this.connectedSubcomponents[i].name + "_" + this.connectedSubcomponents[i].interfaceEdges[interfaceEdge][edge]);
                }
            }
        }
        for(var i = 0, len = this.connections.length; i < len; i++) {
            this.componentObj.connectedInterfaces[this.connections[i].interface1.replaceAll(".", "_")] = true;
            this.componentObj.connectedInterfaces[this.connections[i].interface2.replaceAll(".", "_")] = true;
        }
        highlightInterfaces(this.componentObj);
        this.scene.add(this.componentObj);
    }

    loadSymbolic(obj, n) {
        debugObj = obj;
        var objMesh = createMeshFromObject(obj);

        objMesh.name = n;
        objMesh.className = this.compName;
        objMesh.interfaces = {};
        objMesh.interfaceEdges = obj["interfaceEdges"];
        objMesh.connectedInterfaces = {};
        objMesh.parameterfuncs = {};
        this.subcomponents.push(objMesh);
        highlightInterfaces(objMesh);
        this.comp.subcomponents[objMesh.name] = this.comp.subcomponents.addFolder(objMesh.name);
        var constrs = this.comp.subcomponents[objMesh.name].addFolder("Constrain Parameters");
        objMesh.parameters = obj['parameters'];
        for(var pars in objMesh.parameters){
            var constraintButton = {
                mechInterface: undefined,
                controller: undefined,
                c: pars,
                constrain:function(){
                  console.log("constrain");
                  console.log(this.mechInterface.id, objMesh.name, this.c, value);

                    var value = window.prompt("Set " + objMesh.name + "_" + this.c + " to: ");
                    constrainParameter(this.mechInterface.id, objMesh.name, this.c, value);
                    this.controller.name(this.c + " = " + value);
                }
            }
            constraintButton.mechInterface = this;

            var controller = constrs.add(constraintButton, "constrain");
            constraintButton.controller = controller;
            controller.name(pars);
            //if(objMesh.parameters[i] == null)
            //    objMesh.parameters[i] = "";

            //objMesh.parameterfuncs[i] = "";
            //f.add(constraintButton, "constrain").name("Constrain");
            //f.add(objMesh.parameters,i).name("Value");
            //f.add(objMesh.parameterfuncs,i).name("Function");
        }
        /*var ints = comp.subcomponents[objMesh.name].addFolder("Inherit Interfaces");
        for(var i in componentLibrary[objMesh.className].interfaces){
            var inheritButton = {
                controller: undefined,
                name: objMesh.name,
                interface: componentLibrary[objMesh.className].interfaces[i],
                inherit: function(){
                    var intName = window.prompt("Name for inherited interface: ");
                    this.controller.name(this.interface + ": Inherited as " + intName);
                    inheritInterface(intName, this.name, this.interface);
                }
            }
            var controller = ints.add(inheritButton, "inherit");
            inheritButton.controller = controller;
            controller.name(inheritButton.interface);
            //objMesh.interfaces[componentLibrary[objMesh.className].interfaces[i]] = false;
        }*/
        this.scene.add(objMesh);
        /*for(i in objMesh.interfaces){
            var contr = ints.add(objMesh.interfaces,i)
            contr.name(i);
        }*/
        var removeButton = {
            mechInterface: null,
            delName: objMesh.name,
            remove: function(){
                for(var i = 0, len = this.mechInterface.subcomponents.length; i < len; i++){
                    if(this.mechInterface.subcomponents[i].name == this.delName){
                        if(this.mechInterface.SELECTED != undefined && this.mechInterface.SELECTED.name == this.mechInterface.subcomponents[i].name){
                            this.mechInterface.control.detach(this.mechInterface.subcomponents[i].name);
                            this.mechInterface.SELECTED = undefined;
                        }
                        this.mechInterface.scene.remove(this.mechInterface.subcomponents[i]);
                        this.mechInterface.subcomponents.splice(i,1);
                        break;
                    }
                }
                removeByName(this.mechInterface.connectedSubcomponents, this.delName);
                this.mechInterface.comp.subcomponents.removeFolder(this.delName);
                for(var i = 0, len = this.mechInterface.connections.length; i < len; i++){
                    if(this.mechInterface.connections[i].interface1.substr(0, this.mechInterface.connections[i].interface1.indexOf(".")) == this.delName)
                    {
                        var otherName = this.mechInterface.connections[i].interface2.substr(0, this.mechInterface.connections[i].interface2.indexOf("."));
                        for(var j = 0, slen = this.mechInterface.subcomponents.length; j < slen; j++){
                            if(this.mechInterface.subcomponents[j].name == otherName)
                                delete this.mechInterface.subcomponents[j].connectedInterfaces[this.mechInterface.connections[i].interface2.substr(this.mechInterface.connections[i].interface2.indexOf(".")+1)];
                        }
                        for(var j = 0, slen = this.mechInterface.connectedSubcomponents.length; j < slen; j++){
                            if(this.mechInterface.connectedSubcomponents[j].name == otherName)
                                delete this.mechInterface.connectedSubcomponents[j].connectedInterfaces[this.mechInterface.connections[i].interface1.substr(this.mechInterface.connections[i].interface1.indexOf(".")+1)];
                        }
                        this.mechInterface.comp.connections.removeFolder(this.mechInterface.connections[i].name);
                        this.mechInterface.connections.splice(i, 1);
                        i--;
                        len--;
                    }
                    else if(this.mechInterface.connections[i].interface2.substr(0, this.mechInterface.connections[i].interface2.indexOf(".")) == this.delName)
                    {
                        var otherName = this.mechInterface.connections[i].interface1.substr(0, this.mechInterface.connections[i].interface1.indexOf("."));
                        for(var j = 0, slen = this.mechInterface.subcomponents.length; j < slen; j++){
                            if(this.mechInterface.subcomponents[j].name == otherName)
                                delete this.mechInterface.subcomponents[j].connectedInterfaces[this.mechInterface.connections[i].interface1.substr(this.mechInterface.connections[i].interface1.indexOf(".")+1)];
                        }
                        for(var j = 0, slen = this.mechInterface.connectedSubcomponents.length; j < slen; j++){
                            if(this.mechInterface.connectedSubcomponents[j].name == otherName)
                                delete this.mechInterface.connectedSubcomponents[j].connectedInterfaces[this.mechInterface.connections[i].interface1.substr(this.mechInterface.connections[i].interface1.indexOf(".")+1)];
                        }
                        this.mechInterface.comp.connections.removeFolder(this.mechInterface.connections[i].name);
                        this.mechInterface.connections.splice(i, 1);
                        i--;
                        len--;
                    }
                }
                var over = '<div id="overlay">' +
                        '<span class="blink_me">LOADING...</span>' +
                        '</div>';
                $(over).appendTo('body');
                delSubcomponent(this.mechInterface.id, this.delName, function(response){$('#overlay').remove();});
            }
        }
        removeButton.mechInterface = this;
        this.comp.subcomponents[objMesh.name].add(removeButton, "remove").name("Delete");
    }

    // CURRENTLY UNUSED
    /*onLoadSTL(geometry) {
        var n = window.prompt("Subcomponent Name","");
        if(n == "" || n == null)
        return;
        var joined = this.subcomponents.concat(this.connectedSubcomponents);
        for(var iter = 0,len = joined.length; iter < len; iter++){
            if(joined[iter].name == n){
                window.alert('Subcomponent with name "' + n + '" already exists');
                return;
            }
        }
        var material = new THREE.MeshPhongMaterial( { color:0xffffff, shading: THREE.FlatShading } );
        var obj = new THREE.Mesh(geometry,material);
        obj.name = n;
        obj.className = this.compName;
        obj.interfaces = {};
        obj.interfaceEdges = this.interfaceEdges;
        obj.parameterfuncs = {};
        this.subcomponents.push(obj);
        for(i in obj.interfaceEdges){
            for(j in this.interfaceEdges[i]){
                if(this.interfaceEdges[i][j] == null)
                continue;
                var material = new THREE.LineBasicMaterial({
                    color: 0xff0000
                });
                var geometry = new THREE.Geometry();
                geometry.vertices.push(
                           new THREE.Vector3( interfaceEdges[i][j][0][0], interfaceEdges[i][j][0][1], interfaceEdges[i][j][0][2] ),
                           new THREE.Vector3( interfaceEdges[i][j][1][0], interfaceEdges[i][j][1][1], interfaceEdges[i][j][1][2] )
                           );
                var line = new THREE.Line( geometry, material );
                line.name = i;
                obj.add(line);
            }
        }
        this.comp.subcomponents[obj.name] = this.comp.subcomponents.addFolder(obj.name);
        var constrs = this.comp.subcomponents[obj.name].addFolder("Constraints");
        /*picoModule.getParameters(this.compName,function(response){
        obj.parameters = response;
        for(i in obj.parameters){
            var f = constrs.addFolder(i);
            if(obj.parameters[i] == null)
            obj.parameters[i] = "";
            obj.parameterfuncs[i] = "";
            f.add(obj.parameters,i).name("Value");
            f.add(obj.parameterfuncs,i).name("Function");
        }
        });*/
    /*    for(i in this.componentLibrary[obj.className].interfaces) {
            obj.interfaces[componentLibrary[obj.className].interfaces[i]] = false;
        }
        this.scene.add(obj);
        var ints = this.comp.subcomponents[obj.name].addFolder("Inherit Interfaces");
        for(i in obj.interfaces){
            var contr = ints.add(obj.interfaces,i)
            contr.name(i);
        }
    }*/

    // CURRENTLY UNUSED
    /* onComponentSTL(geometry) {
        if(this.componentObj)
            this.scene.remove(this.componentObj);
        material = new THREE.MeshPhongMaterial( {color:0xffffff,shading:THREE.FlatShading});
        this.componentObj = new THREE.Mesh(geometry,material);
        this.scene.add(this.componentObj);
    }*/

    handleError(e) {
        var ind = e.exception.search("Parameter ");
        if(ind != -1){
            var param = [];
            if(e.exception.charAt(ind+10) == '[')
                param = eval(e.exception.substring(ind+10,e.exception.search(']')+1))
            else{
                var strip = e.exception.substring(ind+10);
                param.push(strip.substring(0,strip.search(' ')));
            }
            for(var i = 0, len = param.length; i < len; i++){
                var val = window.prompt("Set value for parameter " + param[i]);
                if(val == "" || val == null)
                return;
                this.tempParams[param[i]] = parseInt(val);
            }
            var args = [this.compName,this.tempParams];
            /*picoModule.generate_stl(args, function(response){
                tempParams = {};
                console.log(response);
                interfaceEdges = response;
                stl_loader.load('models/' + compName + '/graph-model.stl',onLoadSTL);
            });*/
        }
        else
            window.alert(e.exception);
    }

    getComponents() {
        //for(var key in componentMenus){
            var mech = this;
            getComponentList("" ,function(response){
            response = JSON.parse(response).response;
            for(var i = 0; i < response.length; i++){
                mech.componentLibrary[response[i][0]] = { interfaces: response[i][1] };
                var button = {
                    mechInterface: undefined,
                    compName: response[i][0],
                    add: function() {
                        this.mechInterface.compName = this.compName;
                        var args = [this.compName,this.mechInterface.tempParams];
                        this.mechInterface.componentCount++;
                        var n = window.prompt("Subcomponent Name","");
                        if(n == "" || n == null)
                            return;
                        var joined = this.mechInterface.subcomponents.concat(this.mechInterface.connectedSubcomponents);
                        for(var iter = 0, len = joined.length; iter < len; iter++){
                            if(joined[iter].name == n){
                                window.alert('Subcomponent with name "' + n + '" already exists');
                                return;
                            }
                        }
                        var over = '<div id="overlay">' +
                            '<span class="blink_me">LOADING...</span>' +
                            '</div>';
                        $(over).appendTo('body');
                        var mechInterface = this.mechInterface;
                        addSubcomponent(this.mechInterface.id, n, this.mechInterface.compName, function(response){
                            response = JSON.parse(response).response;
                            mechInterface.tempParams = {};
                            mechInterface.loadSymbolic(response, n);
                            /*interfaceEdges = response;
                              stl_loader.load('models/' + compName + '/graph-model.stl',onLoadSTL);*/
                            $('#overlay').remove();
                        });
                    }
                }
                button.mechInterface = mech;
                mech.componentsFolder.add(button,"add").name(response[i][0]);
            }
            });
    }

    loadGui() {
        var search = {
            Search: ""
        };
        var filters = {
            Mechanical: true,
            Electrical: true,
            Software: true
        };
        this.gui = new dat.GUI({ autoPlace: false, width: this.tabDom.getElementsByClassName('left-panel')[0].clientWidth, scrollable: true });
        this.gui.domElement.removeChild(this.gui.__closeButton);
        this.tabDom.getElementsByClassName('left-panel')[0].appendChild(this.gui.domElement);
        this.gui.add(search, "Search");
        this.searchFilters = this.gui.addFolder("Filters");
        this.searchFilters.add(filters, "Mechanical");
        this.searchFilters.add(filters, "Electrical");
        this.searchFilters.add(filters, "Software");
        this.componentsFolder = this.gui.addFolder('Components');
        this.componentsFolder.open();
        //componentMenus["mechanical"] = componentsFolder.addFolder("Mechanical");
        //componentMenus["device"] = componentsFolder.addFolder("Device");
        //componentMenus["actuator"] = componentsFolder.addFolder("Actuators");
        //componentMenus["sensor"] = componentsFolder.addFolder("Sensors");
        //componentMenus["UI"] = componentsFolder.addFolder("UI");
        this.rightpanel = new dat.GUI({ autoPlace: false, width: this.tabDom.getElementsByClassName('right-panel')[0].clientWidth, scrollable: true });
        this.rightpanel.domElement.removeChild(this.rightpanel.__closeButton);
        // console.log(this.rightpanel.domElement);
        this.tabDom.getElementsByClassName('right-panel')[0].appendChild(this.rightpanel.domElement);
        this.comp = this.rightpanel.addFolder(this.componentName);
        this.comp.open();
        this.comp.parameters = this.comp.addFolder("Parameters");
        this.comp.interfaces = this.comp.addFolder("Interfaces");
        this.comp.subcomponents = this.comp.addFolder("Subcomponents");
        this.comp.connections = this.comp.addFolder("Connections");

        var objectbuttons = {
            mechInterface: undefined,
            subcomponentDelete: function(){
                var delName = window.prompt("Name of subcomponent to delete","");
                if(delName == "" || delName == null)
                return;
                for(var i = 0, len = this.mechInterface.subcomponents.length; i < len; i++){
                    if(this.mechInterface.subcomponents[i].name == delName){
                        if(this.mechInterface.SELECTED.name == this.mechInterface.subcomponents[i].name){
                            this.mechInterface.control.detach(this.mechInterface.subcomponents[i].name);
                            this.mechInterface.SELECTED = undefined;
                        }
                        this.mechInterface.scene.remove(this.mechInterface.subcomponents[i]);
                        this.mechInterface.subcomponents.splice(i,1);
                        break;
                    }
                }
                removeByName(this.mechInterface.connectedSubcomponents, delName);
                this.mechInterface.comp.subcomponents.removeFolder(delName);
            },
            connectionAdd: function(){
                if(this.mechInterface.SELECTED != undefined && this.mechInterface.SELECTED_2 != undefined && this.mechInterface.SELECTED.parent != "Scene" && this.mechInterface.SELECTED_2.parent != "Scene") {
                    var newConn = {};
                    newConn.name = window.prompt("Connection Name: ");
                    if(newConn.name == "" || newConn.name == null)
                        return;
                    for(var iter = 0, len = this.mechInterface.connections.length; iter < len; iter++){
                        if(this.mechInterface.connections[iter].name == newConn.name){
                            window.alert('Connection with name "' + newConn.name + '" already exists');
                            return;
                        }
                    }
                    var angle = window.prompt("Connection Angle: ");
                    if(angle == "" || angle == null || isNaN(angle))
                        return;
                    var s1pname, s1name, s2pname, s2name;
                    if(this.mechInterface.SELECTED.parent.type == "MasterComponent"){
                        newConn.interface1 = this.mechInterface.SELECTED.name.replaceAll("_", ".");
                        var spl = this.mechInterface.SELECTED.name.split("_");
                        s1pname = spl[0];
                        s1name = spl[1];
                    }
                    else {
                        newConn.interface1 = this.mechInterface.SELECTED.parent.name + "." + this.mechInterface.SELECTED.name;
                        s1pname = this.mechInterface.SELECTED.parent.name;
                        s1name = this.mechInterface.SELECTED.name;
                    }
                    if(this.mechInterface.SELECTED_2.parent.type == "MasterComponent") {
                        newConn.interface2 = this.mechInterface.SELECTED_2.name.replaceAll("_", ".");
                        var spl = this.mechInterface.SELECTED_2.name.split("_");
                        s2pname = spl[0];
                        s2name = spl[1];
                    }
                    else {
                        newConn.interface2 = this.mechInterface.SELECTED_2.parent.name + "." + this.mechInterface.SELECTED_2.name;
                        s2pname = this.mechInterface.SELECTED_2.parent.name;
                        s2name = this.mechInterface.SELECTED_2.name;
                    }
                    var over = '<div id="overlay">' +
                                '<span class="blink_me">LOADING...</span>' +
                                '</div>';
                        $(over).appendTo('body');
                    addComponentConnection(this.mechInterface.id,s1pname,s1name,s2pname,s2name, angle, function(){$('#overlay').remove();});//function(){buildComponent()});
                    this.mechInterface.connections.push(newConn);
                    this.mechInterface.SELECTED.parent.connectedInterfaces[this.mechInterface.SELECTED.name] = newConn.interface2;
                    this.mechInterface.SELECTED_2.parent.connectedInterfaces[this.mechInterface.SELECTED_2.name] = newConn.interface1;
                    var folder = this.mechInterface.comp.connections.addFolder(newConn.name);
                    newConn.args = "";
                    var connFixButton = {
                        mechInterface: undefined,
                        s1pname: s1pname,
                        s1name: s1name,
                        fixConnection:function(){
                            var value = window.prompt("Value to fix interface to");
                            fixComponentEdgeInterface(this.mechInterface.id,this.s1pname, this.s1name, value);
                        }
                    }
                    connFixButton.mechInterface = this.mechInterface;
                    folder.add(newConn,"interface2").name(newConn.interface1);
                    folder.add(connFixButton, "fixConnection").name("Set Length");
                }
                /*else{
                var joinedList = subcomponents.concat(connectedSubcomponents);
                for(i in joinedList){
                    for(inter in joinedList[i].interfaces){
                    var opt = document.createElement("option");
                    var opt2 = document.createElement("option");
                    var str = joinedList[i].name + "." + inter;
                    opt.val = str; opt2.val = str;
                    opt.innerHTML = str; opt2.innerHTML = str;
                    document.getElementById('interface1').appendChild(opt);
                    document.getElementById('interface2').appendChild(opt2);
                    }
                }
                $("#dialog").dialog("open");
                }*/
            },
            connectionAddTab: function(){
                if(this.mechInterface.SELECTED != undefined && this.mechInterface.SELECTED_2 != undefined && this.mechInterface.SELECTED.parent != "Scene" && this.mechInterface.SELECTED_2.parent != "Scene") {
                    var newConn = {};
                    newConn.name = window.prompt("Connection Name: ");
                    if(newConn.name == "" || newConn.name == null)
                        return;
                    for(var iter = 0, len = this.mechInterface.connections.length; iter < len; iter++){
                        if(this.mechInterface.connections[iter].name == newConn.name){
                        window.alert('Connection with name "' + newConn.name + '" already exists');
                        return;
                        }
                    }
                    var angle = window.prompt("Connection Angle: ");
                    if(angle == "" || angle == null || isNaN(angle))
                        return;
                    var s1pname, s1name, s2pname, s2name;
                    if(this.mechInterface.SELECTED.parent.type == "MasterComponent"){
                        newConn.interface1 = this.mechInterface.SELECTED.name.replaceAll("_", ".");
                        var spl = this.mechInterface.SELECTED.name.split("_");
                        s1pname = spl[0];
                        s1name = spl[1];
                    }
                    else {
                        newConn.interface1 = this.mechInterface.SELECTED.parent.name + "." + this.mechInterface.SELECTED.name;
                        s1pname = this.mechInterface.SELECTED.parent.name;
                        s1name = this.mechInterface.SELECTED.name;
                    }
                    if(this.mechInterface.SELECTED_2.parent.type == "MasterComponent") {
                        newConn.interface2 = this.mechInterface.SELECTED_2.name.replaceAll("_", ".");
                        var spl = this.mechInterface.SELECTED_2.name.split("_");
                        s2pname = spl[0];
                        s2name = spl[1];
                    }
                    else {
                        newConn.interface2 = this.mechInterface.SELECTED_2.parent.name + "." + this.mechInterface.SELECTED_2.name;
                        s2pname = this.mechInterface.SELECTED_2.parent.name;
                        s2name = this.mechInterface.SELECTED_2.name;
                    }
                    addTabConnection(this.mechInterface.id,s1pname,s1name,s2pname,s2name, angle, function(){});//function(){buildComponent()});
                    this.mechInterface.connections.push(newConn);
                    this.mechInterface.SELECTED.parent.connectedInterfaces[this.mechInterface.SELECTED.name] = newConn.interface2;
                    this.mechInterface.SELECTED_2.parent.connectedInterfaces[this.mechInterface.SELECTED_2.name] = newConn.interface1;
                    var folder = this.mechInterface.comp.connections.addFolder(newConn.name);
                    newConn.args = "";
                    var connFixButton = {
                        s1pname: s1pname,
                        s1name: s1name,
                        fixConnection:function(){
                            var value = window.prompt("Value to fix interface to");
                            fixComponentEdgeInterface(this.s1pname, this.s1name, value);
                        }
                    }
                    folder.add(newConn,"interface2").name(newConn.interface1);
                    folder.add(connFixButton, "fixConnection").name("Set Length");
                }
                /*else{
                var joinedList = subcomponents.concat(connectedSubcomponents);
                for(i in joinedList){
                    for(inter in joinedList[i].interfaces){
                    var opt = document.createElement("option");
                    var opt2 = document.createElement("option");
                    var str = joinedList[i].name + "." + inter;
                    opt.val = str; opt2.val = str;
                    opt.innerHTML = str; opt2.innerHTML = str;
                    document.getElementById('interface1').appendChild(opt);
                    document.getElementById('interface2').appendChild(opt2);
                    }
                }
                $("#dialog").dialog("open");
                }*/
            },
            connectionDelete:function(){
                var delName = window.prompt("Name of connection to delete","");
                if(delName == "" || delName == null)
                return;
                removeByName(this.mechInterface.connections,delName);
                this.mechInterface.comp.connections.removeFolder(delName);
            },
            parameterAdd:function(){
                console.log("add parameter");
                var fieldName = window.prompt("Parameter name","");
                if(fieldName == "" || fieldName == null)
                return;
                if(this.mechInterface.parameters[fieldName] != undefined){
                window.alert('Parameter "' + fieldName + '" already exists');
                return;
                }
                var pdef = window.prompt("Default value: ");
                if(pdef == "" || pdef == null || isNaN(pdef))
                    return;
                console.log("add parameter", this.mechInterface.parameters);
                this.mechInterface.parameters[fieldName] = pdef;
                this.mechInterface.comp.parameters.add(this.mechInterface.parameters, fieldName).name(fieldName);
                addParameter(this.mechInterface.id,fieldName, pdef);
            },
            parameterDelete:function(){
                var delName = window.prompt("Name of parameter to delete","");
                if(delName == "" || delName == null)
                return;
                delete this.mechInterface.parameters[delName];
                for(var i = 2, len = this.mechInterface.comp.parameters.__controllers.length; i < len; i++){
                if(this.mechInterface.comp.parameters.__controllers[i].__li.firstElementChild.firstElementChild.innerHTML == delName)
                    this.mechInterface.comp.parameters.remove(this.mechInterface.comp.parameters.__controllers[i]);
                }
                delParameter(this.mechInterface.id,delName);
            },
            interfaceAdd:function(){
                if(this.mechInterface.SELECTED != undefined && this.mechInterface.SELECTED.parent != "Scene")
                {
                    var name = window.prompt("Name for inherited interface: ");
                    if(name == "" || name == null)
                        return;
                    var s1pname, s1name;
                    if(this.mechInterface.SELECTED.parent.type == "MasterComponent"){
                        var spl = this.mechInterface.SELECTED.name.split("_");
                        s1pname = spl[0];
                        s1name = spl[1];
                    }
                    else {
                        s1pname = this.mechInterface.SELECTED.parent.name;
                        s1name = this.mechInterface.SELECTED.name;
                    }
                    this.mechInterface.interfaces[name] = s1pname + "." + s1name;
                    this.mechInterface.comp.interfaces.add(this.mechInterface.interfaces, name).name(name);
                    inheritInterface(this.mechInterface.id,name, s1pname, s1name);
                }
            },
            interfaceDelete:function(){
                var delName = window.prompt("Name of interface to delete","");
                if(delName == "" || delName == null)
                return;
                delete this.mechInterface.interfaces[delName];
                for(var i = 2, len = this.mechInterface.comp.interfaces.__controllers.length; i < len; i++){
                if(this.mechInterface.comp.interfaces.__controllers[i].__li.firstElementChild.firstElementChild.innerHTML == delName)
                    this.mechInterface.comp.interfaces.remove(this.mechInterface.comp.interfaces.__controllers[i]);
                }
                delInterface(this.mechInterface.id,delName);
            }
        }
        objectbuttons.mechInterface = this;
        //comp.subcomponents.add(objectbuttons,'subcomponentDelete').name("Remove");
        this.comp.parameters.add(objectbuttons,'parameterAdd').name("Add");
        this.comp.parameters.add(objectbuttons,'parameterDelete').name("Delete");
        this.comp.connections.add(objectbuttons,'connectionAdd').name("Add");
        this.comp.connections.add(objectbuttons,'connectionAddTab').name("Add Tab");
        this.comp.interfaces.add(objectbuttons, 'interfaceAdd').name("Add");
        this.comp.interfaces.add(objectbuttons, 'interfaceDelete').name("Delete");
        //comp.connections.add(objectbuttons,'connectionDelete').name("Remove");
    }

    buildComponent() {
        var over = '<div id="overlay">' +
                '<span class="blink_me">LOADING...</span>' +
                '</div>';
        $(over).appendTo('body');
        var thisComponent = {};
        thisComponent.name = this.componentName;
        thisComponent.subcomponents = [];
        stripObjects(this.subcomponents,thisComponent.subcomponents);
        stripObjects(this.connectedSubcomponents,thisComponent.subcomponents);
        thisComponent.parameters = this.parameters;
        thisComponent.connections = this.connections;
        var mechInterface = this;
        makeComponent(this.id, function(response){
            response = JSON.parse(response).response;
            if(mechInterface.SELECTED != undefined){
                mechInterface.control.detach(mechInterface.SELECTED);
                mechInterface.SELECTED = undefined;
            }
            for(var i = 0, len = mechInterface.connectedSubcomponents.length;i < len; i++)
                mechInterface.connectedSubcomponents[i] = updateComponent(mechInterface.connectedSubcomponents[i],response);
            while(mechInterface.subcomponents.length > 0){
                mechInterface.scene.remove(mechInterface.subcomponents[mechInterface.subcomponents.length-1]);
                mechInterface.subcomponents[mechInterface.subcomponents.length-1] = updateComponent(mechInterface.subcomponents[mechInterface.subcomponents.length-1],response);
                mechInterface.connectedSubcomponents.push(mechInterface.subcomponents[mechInterface.subcomponents.length-1]);
                mechInterface.subcomponents.splice(mechInterface.subcomponents.length-1,1);
            }
            mechInterface.onComponentSymbolic(response);
        //	stl_loader.load('models/' + componentName + '/graph-model.stl',onComponentSTL);
        //	document.getElementById('svg-view').src = 'models/' + componentName + '/graph-print.svg';

            mechInterface.tabDom.getElementsByClassName('sComp')[0].disabled = false;
            //document.getElementById('dModel').disabled = false;
            //document.getElementById('sComp').disabled = false;
            $('#overlay').remove();
            mechInterface.viewSVG();
        });
    }

    render() {
        if(this.control)
            this.control.update();
        if(this.renderer)
            this.renderer.render( this.scene, this.camera );
    }

    viewSVG(){
        var over = '<div id="overlay">' +
                        '<span class="blink_me">LOADING...</span>' +
                        '</div>';
        $(over).appendTo('body');
        var mechInterface = this;
        var drawing_div = this.tabDom.getElementsByClassName('svg-view')[0];
         getSVG(this.id, function(response){
            response = JSON.parse(response).response;
            drawing_div.style.backgroundColor = 'white'
            //drawing_div.style.padding = "2%";
            drawing_div.innerHTML = response;
            mechInterface.tabDom.getElementsByClassName('dSVG')[0].disabled = false;
            $('#overlay').remove();
          });
    }

    resize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
        this.tabDom.getElementsByClassName('left-panel')[0].style.height = window.innerHeight;
    }
}

function onKeyDown(event) {
    var control = null;
    for(var i = 0, len = tabs.length; i < len; i++) {
        if (tabs[i].div.style.display != "none" && tabs[i].mechanicalInterface != undefined) {
            control = tabs[i].mechanicalInterface.control;
        }
    }
    if (control != null) {
        switch ( event.keyCode ) {
        /*    case 81: // Q
              control.setSpace( control.space === "local" ? "world" : "local" );
              break;
        case 17: // Ctrl
        control.setTranslationSnap( 100 );
        control.setRotationSnap( THREE.Math.degToRad( 15 ) );
        break;*/
        case 87: // W
            control.setMode( "translate" );
            break;
        case 69: // E
            control.setMode( "rotate" );
            break;
        case 82: // R
            control.setMode( "scale" );
            break;
        /*    case 187:
        case 107: // +, =, num+
        control.setSize( control.size + 0.1 );
        break;
        case 189:
        case 109: // -, _, num-
        control.setSize( Math.max( control.size - 0.1, 0.1 ) );
        break;
        case 66: // B
        buildComponent();
        break;*/
        }
    }
}

function onWindowResize() {
    for(var i = 0, len = tabs.length; i < len; i++) {
        if (tabs[i].mechanicalInterface != undefined) {
            tabs[i].mechanicalInterface.resize();
        }
    }
}

function addPopupToDOM(popup, x, y) {
  // add popup to view container
  var viewContainer = document.getElementById("popup_container");
  // console.log(viewContainer);
  // discount the width of left column and the height of the bar on top
  // viewContainer.style.left = x-256;
  viewContainer.style.left = x-220;
  viewContainer.style.top = y-52;
  viewContainer.append(popup);
}

function removePopupFromDOM() {
  var popup = document.getElementById("mouseMovePopup");
  if (popup)
    popup.remove();
}

function scParamsPopup(sc) {
  var newPopup = document.createElement("div");
  newPopup.className = "popup"
  newPopup.id = "mouseMovePopup"
  var scObj = sc.object;
  var cname = document.createTextNode(scObj.className+": "+scObj.name);

  var parametersContainer = document.createElement("div");

  for (var parameter in scObj.parameters) {
    var parameterDisplayString = document.createTextNode(parameter + ":" + scObj.solved[parameter]);
    parametersContainer.appendChild(parameterDisplayString);
  }

  newPopup.appendChild(cname);
  newPopup.appendChild(parametersContainer);

  return newPopup;
}

function onDocumentMouseMove(mechInterface) {
    return function(event) {
        event.preventDefault();
        mechInterface.mouse.x = ((event.clientX - getLeftPos(mechInterface.container)) / mechInterface.container.clientWidth) * 2 - 1;
        mechInterface.mouse.y = -((event.clientY - $("#tabButtons").outerHeight(true)) / mechInterface.container.clientHeight) * 2 + 1;
        mechInterface.raycaster.setFromCamera( mechInterface.mouse, mechInterface.camera );
        var objs = mechInterface.subcomponents;
        if(mechInterface.componentObj != undefined)
        objs = mechInterface.subcomponents.concat(mechInterface.componentObj);
        var intersects = mechInterface.raycaster.intersectObjects( objs,true );

        // if there are subcomponents at the position of the mouse
        if ( intersects.length > 0 ) {
            mechInterface.container.style.cursor = 'pointer';
            // Check if popup box already exists. If not, generate
            // popup box that contains parameters of the face intersected
            var intersect = intersects[0]
            // popup the same as previous
            if (previousPopUpId != undefined && intersect.uuid  == previousPopUpId)
              return;
            else
              removePopupFromDOM();

            // add popup
            addPopupToDOM(scParamsPopup(intersect), event.x, event.y);
            previousPopUpId = intersect.uuid;
        } else {
            mechInterface.container.style.cursor = 'auto';

            // remove popup
            removePopupFromDOM();
        }
    }
}

function onDocumentMouseDown(mechInterface) {
  console.log("document mouse down");
    return function(event) {
        event.preventDefault();
        mechInterface.raycaster.setFromCamera( mechInterface.mouse, mechInterface.camera );
        var objs = mechInterface.subcomponents;
        if(mechInterface.componentObj != undefined)
            objs = mechInterface.subcomponents.concat(mechInterface.componentObj);
        var intersects = mechInterface.raycaster.intersectObjects( objs, true );
        console.log("intersects", intersects);
        var obj;
        if(!event.shiftKey)
            obj = mechInterface.SELECTED;
        else
            obj = mechInterface.SELECTED_2;
        console.log("obj", obj);
        if ( intersects.length > 0 ) {
            if(obj != undefined && obj.parent.type != "Scene") {

                // create a popup box, showing parameters and allowing users
                // to edit parameters of faces
                var popup = document.createElement("div");
                popup.className = "popup"
                var cname = document.createTextNode(mechInterface.compName+": "+mechInterface.componentName);

                var parametersContainer = document.createElement("div");

                console.log(mechInterface);
                // console.log(mechInterface.SELECTED.uuid);

                for (var i = 0; i < mechInterface.subcomponents.length; i++) {
                  var sc = mechInterface.subcomponents[i];

                  sc.children.map(function(c) {
                    if (c.uuid == obj.uuid) {
                      console.log("display ", sc.uuid);
                      // display parameters of subcomponents
                      for (var parameter in sc.parameters) {
                        var parameterDisplayString = document.createTextNode(parameter + ":" + sc.solved[parameter]);
                        parametersContainer.appendChild(parameterDisplayString);
                      }
                      return;
                    }
                  })
                }

                popup.appendChild(cname);
                popup.appendChild(parametersContainer);


                var viewContainer = document.getElementById("popup_container");
                viewContainer.append(popup);

                // console.log("g");


                obj.material.color = new THREE.Color(0xff0000);
                if(!event.shiftKey)
                    mechInterface.SELECTED = undefined;
                else
                    mechInterface.SELECTED_2 = undefined;
            }
        /*if(intersects[0].object.parent.type == "MasterComponent")
            {
            if(!event.shiftKey)
                {
                SELECTED = intersects[0].object.parent;
                control.attach(SELECTED);
                }
            }*/
            if(intersects[0].object.parent.type != "Scene"){
                intersects[0].object.material.color = new THREE.Color(0x00ff00);
                if(!event.shiftKey){
                    if(mechInterface.SELECTED != undefined && mechInterface.SELECTED.parent.type == "Scene")
                        mechInterface.control.detach(mechInterface.SELECTED);
                    mechInterface.SELECTED = intersects[0].object;
                }
                else
                    mechInterface.SELECTED_2 = intersects[0].object;
            }
            else
            {
                mechInterface.control.attach(intersects[0].object);
                mechInterface.scene.add(mechInterface.control);
                mechInterface.comp.subcomponents.open();
                if(mechInterface.SELECTED != undefined && mechInterface.SELECTED != mechInterface.componentObj)
                    mechInterface.comp.subcomponents[mechInterface.SELECTED.name].close();
                mechInterface.SELECTED = intersects[0].object;
                if(mechInterface.SELECTED != mechInterface.componentObj)
                    mechInterface.comp.subcomponents[intersects[0].object.name].open();
            }
        }
    }
}

function onDocumentMouseUp( event ) {
    event.preventDefault();
}

function render() {
    requestAnimationFrame(render);
    for(var i = 0, len = tabs.length; i < len; i++) {
        if (tabs[i].div.style.display != "none" && tabs[i].mechanicalInterface != undefined) {
            tabs[i].mechanicalInterface.render();
        }
    }

}

function download (filename, text) {
    var element = document.createElement('a');
    element.setAttribute('name', filename);
    element.setAttribute('href', 'data:image/svg,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function UrlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}

function removeDuplicates(list){
    for(var ele = 0; ele < list.length; ele++){
	    for(var ele2 = 0; ele2 < list.length; ele2++){
	        if(ele != ele2 && list[ele].x == list[ele2].x && list[ele].y == list[ele2].y && list[ele].z == list[ele2].z){
		        list.splice(ele2,1);
		        ele2--;
	        }
	    }
    }
}

function createMeshFromObject(obj)
{
    var material = new THREE.MeshPhongMaterial( { color:0xffffff, shading: THREE.FlatShading } );
    var geometry = new THREE.Geometry();
    for(var face in obj["faces"]){
        transf = new THREE.Matrix4();
        //obj["faces"][face][0] = obj["faces"][face][0].map(function(i){return i.replaceAll("**","^").replaceAll("[","(").replaceAll("]",")")})
        transf.elements = obj["faces"][face][0].map(function(i){return evalPrefix(i,obj["solved"]).value});
        transf.transpose();
        var vertices = [];
        set = new Set();
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
        var triangles = THREE.Shape.Utils.triangulateShape ( vertices, holes );
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
    for(i in objMesh.interfaceEdges) {
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

function removeByName(array,name){
    for(var i = 0, len = array.length; i < len; i++){
        if(array[i].name == name){
            array.splice(i,1);
            break;
        }
    }
}

function stripObjects(list, strippedList){
    for(i in list){
        var strippedObj = {};
        strippedObj.name = list[i].name;
        strippedObj.className = list[i].className;
        strippedObj.parameters = list[i].parameters;
        strippedObj.parameterfuncs = list[i].parameterfuncs;
        strippedObj.interfaces = list[i].interfaces;
        strippedList.push(strippedObj);
    }
}

function updateComponent(component, response)
{
    solution = response["solved"]
    var pos = {};
    var quat = {};
    for(var k in component["solved"]){
	if(k == "dx" || k == "dy" || k == "dz"){
	    pos[k] = solution[component.name + "_" + k];
	    component["solved"][k] = 0;
	}
	else if(k == "q_a" || k == "q_i" || k == "q_j" || k == "q_k"){
	    quat[k] = solution[component.name + "_" + k];
	    if(k == "q_a")
		component["solved"][k] = 1;
	    else
		component["solved"][k] = 0;
	}
	else
	    component["solved"][k] = solution[component.name + "_" + k];
    }
    component['faces'] = {}
    for(var face in response['faces']){
        if (face.startsWith(component.name))
            component['faces'][face] = response['faces'][face];
    }
    /*component['edges'] = {}
    for(var edge in response['edges']){
        if (edge.startsWith(component.name))
            component['edges'][edge] = response['edges'][edge];
    }*/
    newComp = createMeshFromObject(component);
    newComp.position.set(Number(pos.dx),Number(pos.dy),Number(pos.dz));
    newComp.rotation.setFromQuaternion(new THREE.Quaternion(Number(quat.q_i),Number(quat.q_j),Number(quat.q_k),Number(quat.q_a)));
    newComp.name = component.name;
    newComp.className = component.className;
    newComp.interfaces = component.interfaces;
    newComp.interfaceEdges = component.interfaceEdges;
    newComp.connectedInterfaces = component.connectedInterfaces;
    newComp.parameterfuncs = component.parameterFuncs;
    highlightInterfaces(newComp);
    return newComp;
}

function build(){
    for(var i = 0, len = tabs.length; i < len; i++) {
        if (tabs[i].div.style.display != "none" && tabs[i].mechanicalInterface != undefined) {
            tabs[i].mechanicalInterface.buildComponent();
        }
    }
}

function downloadSVG() {
    for(var i = 0, len = tabs.length; i < len; i++) {
        if (tabs[i].div.style.display != "none" && tabs[i].mechanicalInterface != undefined) {
            tabs[i].mechanicalInterface.downloadSVG();
        }
    }
}

function splitComponent() {
    for(var i = 0, len = tabs.length; i < len; i++) {
        if (tabs[i].div.style.display != "none" && tabs[i].mechanicalInterface != undefined) {
            tabs[i].mechanicalInterface.splitComponent();
        }
    }
}

function downloadYaml() {
    for(var i = 0, len = tabs.length; i < len; i++) {
        if (tabs[i].div.style.display != "none" && tabs[i].mechanicalInterface != undefined) {
            tabs[i].mechanicalInterface.downloadYaml();
        }
    }
}

function saveComponent() {
    for(var i = 0, len = tabs.length; i < len; i++) {
        if (tabs[i].div.style.display != "none" && tabs[i].mechanicalInterface != undefined) {
            tabs[i].mechanicalInterface.saveComponent();
        }
    }
}

function fixEdgeInterface() {
    for(var i = 0, len = tabs.length; i < len; i++) {
        if (tabs[i].div.style.display != "none" && tabs[i].mechanicalInterface != undefined) {
            tabs[i].mechanicalInterface.fixEdgeInterface();
        }
    }
}

function getLeftPos(el) {
    for (var leftPos = 0;
	 el != null;
	 leftPos += el.offsetLeft, el = el.offsetParent);
    return leftPos;
}

dat.GUI.prototype.removeFolder = function(name) {
    var folder = this.__folders[name];
    if (!folder) {
	return;
    }
    folder.close();
    this.__ul.removeChild(folder.domElement.parentNode);
    delete this.__folders[name];
    this.onResize();
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

export {MechanicalInterface}
