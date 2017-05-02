var saveas;
var download = false;
// TODO: FIX delete
onkeydown = function(e){
    if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        prevSave()
    } else if(e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.shiftKey){
        e.preventDefault();
        saveas = true;
        prevSave();
        saveas = false;
    } else if (e.keyCode == 27) {
        e.preventDefault();
        abortOpen();
    }
}

function prevSaveAs(){
    saveas = true;
    prevSave();
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

function prevCheck(save){
    if (newSession || saveas) {
        sessionName = window.prompt("Save As: ", sessionName);
        newSession = false;
    }
    if (sessionName) {
        if (sessionName.length > 0) {
            var c = "CC" + sessionName;
            var xhttp = new XMLHttpRequest();
            xhttp.name = "code";
            xhttp.open("POST", "prev_save_check/", true);
            xhttp.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    save();
                } else if(this.readyState == 4 && this.status == 400){
                    var overwrite = confirm("There is already a saved session named " + sessionName + ". Would you like to overwrite it?\n");
                    if(overwrite){
                        save();
                    }
                } else if(this.readyState == 4 && this.status == 403){
                    alert("Corrupted Save Request");
                }
            };
            xhttp.send(c);
        } else {
            window.alert("Invalid Save Name. Name should contain at least one character.");
            newSession = true;
        }
    } else{
        sessionName = "untitled";
        newSession = true;
    }


}
function prevDoSave(){
    var c = "<!--\nCC\n";
    c += sessionName + "\n";
    var blocks = Blockly.getMainWorkspace().getAllBlocks();
    for(var i = 0; i < blocks.length; i++){
        if(blocks[i].type != "component_create" && blocks[i].type != "inherit_input"){
            name = blocks[i].type;
            b = name.substring(0, name.indexOf("|"));
            name = name.substring(name.indexOf("|") + 1);
            if(typeof BlockList.get(b) === "undefined"){
                BlockList.set(b, new Map());
                var m = BlockList.get(b);
                if(name.includes("\\")){
                    m.set(name.substring(0, name.indexOf("\\")), ["",[name.substring(name.indexOf("\\") + 1)]]);
                } else{
                    m.set(name, [blocks[i].id,[]]);
                }

                BlockList.set(b, m);
            } else{
                var m = BlockList.get(b);
                if(name.includes("\\")){
                    var iter = name.substring(0, name.indexOf("\\"));
                    if (m.get(iter) === undefined) {
                        m.set(iter, ["",[]])
                    }
                    var outs = m.get(iter)[1];
                    if(outs.indexOf(name.substring(name.indexOf("\\") + 1)) < 0){
                        outs.push(name.substring(name.indexOf("\\") + 1));
                    }
                    m.set(iter, [m.get(iter)[0], outs]);
                } else{
                    if (m.get(name) === undefined) {
                        m.set(name, [blocks[i].id, []]);
                    } else{
                        m.set(name, [blocks[i].id, m.get(name)[1]]);
                    }

                }

                BlockList.set(b, m)
            }
        }
    }
    function addToSave(value, key, map){
        c+= key + "\0";
        var a = Array.from(value.keys());
        for (var i = 0; i < a.length; i++) {
            c += (a[i] + String.fromCharCode(1));
            c += (value.get(a[i])[0] + String.fromCharCode(1));
            c += (value.get(a[i])[1] + String.fromCharCode(1));
        }
        c += "\n";
    }
    BlockList.forEach(addToSave);
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
                window.location.assign("CC"+sessionName + ".cpr/");
            } else{
                window.alert("\"" + sessionName + "\""+ " Saved.");
            }
        }
        if(this.readyState == 4 && this.status == 400){
            window.alert("Corrupted Save");
        }
    };

    xhttp.send(c);
    BlockList = new Map();
}
function prevSave() {
    prevCheck(prevDoSave);
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
                var c = "CC" + this.getAttribute("id");
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

                        if (mode != "CC" || !this.div.getAttribute("id").includes(name)){
                            alert("Corrupted Save file");
                        } else{
                            processCCOpen(save);
                        }
                    } else if(this.readyState == 4 && this.status == 400){
                        alert("Corrupted load");
                    }
                };

                xhttp.send(c);
            };
            mainDiv.appendChild(nameDiv);
            mainDiv.appendChild(dateDiv);
            cont.appendChild(mainDiv)
        }
    }
}

function processCCOpen(save) {
    while (save.indexOf("-->") > 0) {
        name = save.substring(0, save.indexOf("\0"));
        if(typeof BlockList.get(name) === "undefined"){
            BlockList.set(name, new Map());
        }
        save = save.substring(save.indexOf("\0") + 1);
        while(save.charAt(0) != "\n"){
            var iter = save.substring(0, save.indexOf(String.fromCharCode(1)));
            save = save.substring(save.indexOf(String.fromCharCode(1)) + 1);
            var id = save.substring(0, save.indexOf(String.fromCharCode(1)));
            save = save.substring(save.indexOf(String.fromCharCode(1)) + 1);
            var outs = save.substring(0, save.indexOf(String.fromCharCode(1)));
            save = save.substring(save.indexOf(String.fromCharCode(1)) + 1);
            outs = outs + ",";
            var m = BlockList.get(name);
            m.set(iter, [id, []]);
            var o = m.get(iter)[1];
            while (outs.indexOf(",") >= 0){
                o.push(Number(outs.substring(0, outs.indexOf(","))));
                outs = outs.substring(outs.indexOf(",") + 1);
            }

            m.set(iter, [id, o]);
        }
        save = save.substring(save.indexOf("\n") + 1);
    }

    save = save.substring(save.indexOf("\n")+1);


    // var blocks = Blockly.getMainWorkspace().getAllBlocks();
    var keys = Array.from(BlockList.keys());


    // loop through all the blocks from BlockList and give default
    // initial definitions to all the blocks in the xml
    for (var l = 0; l < keys.length; l++) {
        var name = keys[l];
        var m = BlockList.get(name);
        var ks = Array.from(m.keys());
        for (var i = 0; i < ks.length; i++) {
            eval("make" + name + "(" + Number(ks[i]) + ")");
            eval("makeOutput" + name + "(" + Number(ks[i]) + ")");
        }
    }

    // now create blocks from xml
    var workspace = Blockly.getMainWorkspace();
    workspace.clear();
    var xml = Blockly.Xml.textToDom(save);
    Blockly.Xml.domToWorkspace(xml, workspace);

    // now, loop through and define blocks with actual names
    for (var l = 0; l < keys.length; l++) {
        var name = keys[l];
        var m = BlockList.get(name);
        var ks = Array.from(m.keys());
        for (var i = 0; i < ks.length; i++) {
            block = Blockly.getMainWorkspace().getBlockById(m.get(ks[i])[0]);
            eval("make" + name + "(" + Number(ks[i]) + ", \"" + block.getFieldValue("NAME") + "\")");
            eval("makeOutput" + name + "(" + Number(ks[i]) + ")");
        }
    }

    // now refresh workspace
    workspace.clear();
    Blockly.Xml.domToWorkspace(xml, workspace);

    // add new categories in the toolbar for block outputs
    if (Toolbox.blocks) {
        console.log(Toolbox.blocks);
        var x = Toolbox.blocks;
        x.parentNode.removeChild(x);
        Toolbox.blocks = null;
    }


    for (var l = 0; l < keys.length; l++) {
        var name = keys[l];
        var m = BlockList.get(name);
        var ks = Array.from(m.keys());
        for (var i = 0; i < ks.length; i++) {
            block = Blockly.getMainWorkspace().getBlockById(m.get(ks[i])[0]);
            if(!Toolbox.blocks){
                Toolbox.blocks = Toolbox.addEmptyCategory("blocks", Toolbox.xmlTree);
            }

            block.cat = Toolbox.addEmptyCategory(block.getFieldValue("NAME"), Toolbox.blocks);
            for (var j = 0; Blockly.Blocks[name + "|" + ks[i] + "\\" + j]; j++) {
                Toolbox.addEmptyBlock(name + "|" + ks[i] + "\\" + j, block.cat);
            }
            for (var j = 0; Blockly.Blocks[name + "|" + ks[i] + "\\" + j]; j++) {
                if (m.get(ks[i])[1].indexOf(j) > -1) {
                    outputCount[name + "|" + ks[i] + "\\" + j] = 1;
                    var outputBlock = name + "|" + ks[i] + "\\" + j;
                    var outs = Toolbox.blocks.childNodes;
                    for(var k =0; k < outs.length; k++){
                        var cat = outs[k].childNodes;
                        var cate = outs[k];
                        for(var p = 0; p < cat.length; p++){
                            if (cat[p].getAttribute("type") == outputBlock) {
                                c = cate;
                                break;
                            }
                        }
                    }
                    Toolbox.disableBlock([outputBlock], c);
                }
            }
        }
    }

    // add new definitions for next blocks
    for (var l = 0; l < keys.length; l++) {
        var name = keys[l];
        var m = BlockList.get(name);
        var ks = Array.from(m.keys());
        var b = ks.map(Number);
        var max = Math.max.apply(null, b);
        // create a new blockly block
        eval("make" + name + "(" + (max + 1) + ")");

        //create a new blockly output block
        eval("makeOutput" + name + "(" + (max + 1) + ")");

        Toolbox.incrementBlock(name, max, block.category);

    }

    // hide opening interface
    abortOpen();
    BlockList = new Map();
}

function prevOpen(){
    var ans = confirm("Are you sure you want to leave the current page? Unsaved changes will not be preserved.");
    if(ans){
        var c = "CC";
        var xhttp = new XMLHttpRequest();
        xhttp.name = "code";
        xhttp.open("POST", "prev_list/", true);
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                addOptions(this.responseText);
            } else if(this.readyState == 4 && this.status == 400){
                alert("Corrupted load");
            }
        };

        xhttp.send(c);
    }
}

function getCCFile(sName){
    download = true;
    prevDoSave();
}

function downloadCCSession(){
    saveas = true;
    prevCheck(getCCFile);
    saveas = false;
}

function uploadCCSession(files) {
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

        if (mode != "CC" || !file.name.includes(name)){
            alert("Corrupted Save file");
        } else{
            processCCOpen(save);
        }
    };
    reader.readAsText(file);
}
