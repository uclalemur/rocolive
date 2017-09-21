var saveas;
var download = false;
// TODO: FIX delete
onkeydown = function(e){
    if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        indexSave()
    } else if(e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.shiftKey){
        e.preventDefault();
        saveas = true;
        indexSave();
        saveas = false;
    } else if (e.keyCode == 27) {
        e.preventDefault();
        abortOpen();
    }
}
function indexCheck(save){
    if (newSession || saveas) {
        sessionName = window.prompt("Save As: ", sessionName);
        newSession = false;
    }
    if (sessionName) {
        if (sessionName.length > 0) {
            var c = "BP" + sessionName;
            var xhttp = new XMLHttpRequest();
            xhttp.name = "code";
            xhttp.open("POST", "prev_save_check/", true);
            xhttp.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    console.log("got 200");
                    save();
                } else if(this.readyState == 4 && this.status == 400){
                    console.log(this.responseText);
                    var overwrite = confirm("There is already a saved session named " + sessionName + ". Would you like to overwrite it?\n");
                    if(overwrite){
                        save();
                    }
                } else if(this.readyState == 4 && this.status == 403){
                    alert("Corrupted Save Request");
                }
            };

            console.log(c);
            xhttp.send(c);
        } else {
            console.log(sessionName);
            window.alert("Invalid Save Name. Name should contain at least one character.");
            newSession = true;
        }
    } else{
        sessionName = "untitled";
        newSession = true;
    }


}
function indexDoSave(){
    var c = "<!--\nBP\n";
    c += sessionName + "\n";
    var numInputs = 0, numParams = 0;
    for (var i = 0; Blockly.Blocks["input" + i]; i++) {
        numInputs++;
    }
    for (var i = 0; Blockly.Blocks["parameter" + i]; i++) {
        numParams++;
    }
    c += (numInputs + "\n");
    c += (numParams + "\n");
    c += "-->\n";
    var workspace = Blockly.getMainWorkspace();
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var data = Blockly.Xml.domToText(xml);
    c += data;
    var xhttp = new XMLHttpRequest();
    xhttp.name = "code";
    xhttp.open("POST", "prev_save/", true);
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            if (download) {
                download = false;
                window.location.assign("BP"+sessionName + ".bpr/");
            } else{
                window.alert("\"" + sessionName + "\""+ " Saved.");
            }
        }
        if(this.readyState == 4 && this.status == 400){
            window.alert("Corrupted Save");
        }
    };

    console.log(c);
    xhttp.send(c);

}
function indexSave() {
    indexCheck(indexDoSave);
}

function indexSaveAs(){
    saveas = true;
    indexSave();
    saveas = false;
}

function abortOpen() {
    var div = document.getElementById("openlist")
    div.style.display = "none";

    div = document.getElementById("list")
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    document.getElementById("dim").style.display = "none";
}


function indexOpen(){
    var ans = confirm("Are you sure you want to leave the current page? Unsaved changes will not be preserved.");
    if(ans){
        var c = "BP";
        var xhttp = new XMLHttpRequest();
        xhttp.name = "code";
        xhttp.open("POST", "prev_list/", true);
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                addOptions(this.responseText);
                console.log(this.responseText);


            } else if(this.readyState == 4 && this.status == 400){
                alert("Corrupted load");
            }
        };

        console.log(c);
        xhttp.send(c);
    }
}

function addOptions(files){
    var c = document.getElementById("openlist");
    var cont = document.getElementById("list");
    var overlay = document.getElementById("dim");
    // var q = document.getElementById("quote");

    c.style.display = "block";
    overlay.style.display = "block";
    // q.innerText = quotes[Math.floor(Math.random()*quotes.length)];

    if (files.length == 0) {
        var mainDiv = document.createElement("DIV");
        mainDiv.innerText = "No Saved Files";
        mainDiv.style.border = "0px";
        mainDiv.style["text-align"] = "center";
        cont.appendChild(mainDiv);
    } else{
        while(files.indexOf("%") > 0){
            var mainDiv = document.createElement("DIV");
            var nameDiv = document.createElement("DIV");
            var dateDiv = document.createElement("DIV");
            var longName = files.substring(0, files.indexOf("%"));
            var name = longName.substring(0, longName.length - 4);
            nameDiv.innerHTML = name;
            files = files.substring(files.indexOf("%") + 1);
            dateDiv.innerHTML = files.substring(0, files.indexOf("%"));
            files = files.substring(files.indexOf("%") + 1);


            mainDiv.setAttribute('class', "mainDiv");
            mainDiv.setAttribute('id', longName);
            nameDiv.setAttribute('class', "nameDiv");
            dateDiv.setAttribute('class', "dateDiv");

            mainDiv.onclick = function (){
                var c = "BP" + this.getAttribute("id");
                var xhttp = new XMLHttpRequest();
                xhttp.name = "code";
                xhttp.div = this;
                xhttp.open("POST", "prev_load/", true);
                xhttp.onreadystatechange = function(){
                    if(this.readyState == 4 && this.status == 200){
                        var save = this.responseText;
                        save = save.substring(save.indexOf("\n")+1);
                        var mode = save.substring(0, save.indexOf("\n"));
                        save = save.substring(save.indexOf("\n")+1);
                        var name = save.substring(0, save.indexOf("\n"));
                        save = save.substring(save.indexOf("\n")+1);

                        if (mode != "BP" || !this.div.getAttribute("id").includes(name)){
                            alert("Corrupted Save file");
                        } else{
                            processBPOpen(save);
                        }
                    } else if(this.readyState == 4 && this.status == 400){
                        alert("Corrupted load");
                    }
                };

                console.log(c);
                xhttp.send(c);
            };
            mainDiv.appendChild(nameDiv);
            mainDiv.appendChild(dateDiv);
            cont.appendChild(mainDiv)
        }
    }
}

function processBPOpen(save) {
    var numInputs = save.substring(0, save.indexOf("\n"))
    save = save.substring(save.indexOf("\n") + 1);
    var numParams = save.substring(0, save.indexOf("\n"))
    save = save.substring(save.indexOf("\n") + 1);
    save = save.substring(save.indexOf("\n") + 1);

    for (var i = 0; i < numInputs; i++) {
        Blockly.Blocks['input' + i] = {
            // mutator blocks for component
            init: function() {
                this.appendDummyInput("NAME")
                    .appendField("Input name");
                this.setOutput(true, null);
                this.setColour(180);
                this.setTooltip('');
                this.setHelpUrl('http://www.example.com/');
            }
        };
    }
    for (var i = 0; i < numParams; i++) {
        Blockly.Blocks['parameter' + i] = {
            // mutator blocks for component
            init: function() {
                this.appendDummyInput("NAME")
                    .appendField("Parameter name");
                this.setOutput(true, null);
                this.setColour(180);
                this.setTooltip('');
                this.setHelpUrl('http://www.example.com/');
            }
        };
    }
    // now create blocks from xml
    var workspace = Blockly.getMainWorkspace();
    workspace.clear();
    var xml = Blockly.Xml.textToDom(save);
    Blockly.Xml.domToWorkspace(xml, workspace);

    // give inputs and parameters their real names from fields.
    // delete blocks from toolbox
    var block = Blockly.getMainWorkspace().getAllBlocks()[0];
    // Delete all input blocks
    for (var i = 0; Blockly.Blocks["input" + i]; i++) {
        Blockly.Blocks["input" + i] = null;
        delete Blockly.Blocks["input" + i];

        Toolbox.deleteBlock("input" + i, Toolbox.componentCategory);
    }
    // Delete all parameter Blocks
    for (var i = 0; Blockly.Blocks["parameter" + i]; i++) {
        Blockly.Blocks["parameter" + i] = null;
        delete Blockly.Blocks["parameter" + i];

        Toolbox.deleteBlock("parameter" + i, Toolbox.componentCategory);
    }

    for (var inputCount = 0; inputCount < numInputs; inputCount++) {
        if (!Blockly.Blocks['input' + inputCount]) {
            Toolbox.addBlock('<block type="' + 'input' + inputCount + '"></block>', Toolbox.componentCategory);
            workspace.updateToolbox(Toolbox.xmlTree);
        }

        // create input block definition
        Blockly.Blocks['input' + inputCount] = {
            // mutator blocks for component
            init: function() {
                this.appendDummyInput("NAME")
                    .appendField("Input " + this.mut_name);
                this.setOutput(true, null);
                this.setColour(180);
                this.setTooltip('');
                this.setHelpUrl('http://www.example.com/');
            }
        };
        Blockly.Blocks['input' + inputCount].mut_name = block.getFieldValue('INPUT_NAME'+inputCount);
        Blockly.Arduino['input' + inputCount] = function(){
            this.codeName = this.mut_name + inputCount;
            return ["<<" + this.mut_name +mangler+">>" + inputCount, Blockly.Arduino.ORDER_ATOMIC];
        }
        Blockly.Python['input' + inputCount] = function(){
            this.codeName = this.mut_name + inputCount;
            return ["<<" + this.mut_name +mangler+">>" + inputCount, Blockly.Python.ORDER_ATOMIC];
        }
    }
    for (var parameterCount = 0; parameterCount < numParams; parameterCount++) {
        // add input block to toolbox
        if (!Blockly.Blocks['parameter' + parameterCount]) {
            Toolbox.addBlock('<block type="' + 'parameter' + parameterCount + '"></block>', Toolbox.componentCategory);
            workspace.updateToolbox(Toolbox.xmlTree);
        }

        // create parameter block definition
        Blockly.Blocks['parameter' + parameterCount] = {
            // mutator blocks for component
            init: function() {
                this.appendDummyInput("NAME")
                    .appendField("Parameter " + this.mut_name);
                this.setOutput(true, null);
                this.setColour(180);
                this.setTooltip('');
                this.setHelpUrl('http://www.example.com/');
            }
        };
        Blockly.Blocks['parameter' + parameterCount].mut_name = block.getFieldValue('PAR_NAME'+parameterCount);
        Blockly.Arduino['parameter' + parameterCount] = function(){
            this.codeName = this.mut_name + parameterCount;
            return ["<<" + this.mut_name + mangler+">>" + parameterCount, Blockly.Arduino.ORDER_ATOMIC];
        }
        Blockly.Python['parameter' + parameterCount] = function(){
            this.codeName = this.mut_name + parameterCount;
            return ["<<" + this.mut_name + mangler+">>" + parameterCount, Blockly.Python.ORDER_ATOMIC];
        }
    }
    Toolbox.updateToolbox();

    // clear and refresh workspace
    var workspace = Blockly.getMainWorkspace();
    workspace.clear();
    var xml = Blockly.Xml.textToDom(save);
    Blockly.Xml.domToWorkspace(xml, workspace);

    // hide opening interface
    abortOpen();
}

function getBPFile(sName){
    download = true;
    indexDoSave();
}

function downloadBPSession(){
    saveas = true;
    indexCheck(getBPFile);
    saveas = false;
}

function uploadBPSession(files) {
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
        var data = event.target.result;
        var save = data;
        save = save.substring(save.indexOf("\n")+1);
        var mode = save.substring(0, save.indexOf("\n"));
        save = save.substring(save.indexOf("\n")+1);
        var name = save.substring(0, save.indexOf("\n"));
        save = save.substring(save.indexOf("\n")+1);

        if (mode != "BP" || !file.name.includes(name)){
            alert("Corrupted Save file");
        } else{
            processBPOpen(save);
        }

        console.log(data);
    };
    reader.readAsText(file);
}
