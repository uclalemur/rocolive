function download(filename, text) {
    var element = document.createElement('a');

    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    console.log(element);
    console.log(element.getAttribute("href").length);
    // element.setAttribute('href', 'data:text/plain;charset=utf-8,' + text);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function checkEmpty(){
    var workspace = Blockly.getMainWorkspace();
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var data = Blockly.Xml.domToText(xml);
    if (data == "<xml xmlns=\"http://www.w3.org/1999/xhtml\"></xml>"){
        return true;
    }
    return false;
}

function downloadCCSession() {
    var workspace = Blockly.getMainWorkspace();
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var data = Blockly.Xml.domToText(xml);
    data = "<!--CC-->" + data;
    console.log(data);
    download("ccsession.ppr", data)
}

function downloadBPSession() {
    var workspace = Blockly.getMainWorkspace();
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var data = Blockly.Xml.domToText(xml);
    data = "<!--BP-->" + data;
    console.log(data);
    download("bpsession.ppr", data)
}


function uploadCCSession(files) {
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
        // console.log(event.target.result);
        var data = event.target.result;
        if (data.substring(0, 9) == "<!--CC-->") {
            data = data.substring(9);
            var workspace = Blockly.getMainWorkspace();
            var xml = Blockly.Xml.textToDom(data);
            Blockly.Xml.domToWorkspace(xml, workspace);
        } else {
            BlocklyStorage.alert("Only CodeComponent saved sessions can be opened here.")
        }
    };
    reader.readAsText(file);
}

function uploadBPSession(files) {
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
        // console.log(event.target.result);
        var data = event.target.result;
        if (data.substring(0, 9) == "<!--BP-->") {
            data = data.substring(9);
            var workspace = Blockly.getMainWorkspace();
            var xml = Blockly.Xml.textToDom(data);
            Blockly.Xml.domToWorkspace(xml, workspace);
        } else {
            BlocklyStorage.alert("Only Blockly Primitive saved sessions can be opened here.")
        }
    };
    reader.readAsText(file);
}
