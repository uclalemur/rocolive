Blockly.Arduino.inherit_input = function(){
    return ["inin_" + this.getFieldValue('NAME') + ">", Blockly.Arduino.ORDER_NONE]
}

Blockly.Arduino.component_create = function() {
    var code = '';
    code += (this.getFieldValue("NAME") + "|");
    code += Blockly.Arduino.statementToCode(this, "CODE");


    for(var i =0; i < this.outputCount; i++){
        code += Blockly.Arduino.valueToCode(this, "OUT" + i) + this.getFieldValue("OUTPUT_NAME"+i) + "^";
    }
    return [code, Blockly.Arduino.ORDER_NONE]
}

function checkBlock(){
    var compDB = {};
    var ininDB = {};
    var outputDB = {};

    // get block
    var block = Blockly.getMainWorkspace().getAllBlocks()[0];

    // ==================================Check Naming Conventions===============

    // check name
    if(block.getFieldValue("NAME").trim().length == 0){
        alert("Give the component a Name.");
        return false;
    }
    var v = block.getFieldValue("NAME");
    if(v.split(/[ \t\n]+/).length > 1){
        alert("The Component's name has to adhere to C variable naming conventions. It cannot contain spaces, tabs, or newlines. Rename component \""+ v +"\"");
        return false;
    }
    if(v.charAt(0)>= '0' && v.charAt(0)<= '9'){
        alert("The Component's name has to adhere to C variable naming conventions. It cannot start with numbers. Rename component \""+ v +"\"");
        return false;
    }
    if(v.split(/[a-zA-Z0-9_]+/).join("").length > 0){
        alert("The Component's name has to adhere to C variable naming conventions. It can only contain uppercase and lowercase letters, digits, and underscores. Rename component \""+ v +"\"");
        return false;
    }

    // check component names
    var b = block.getInput("CODE").connection;

    while(b.targetBlock()){
        b = b.targetBlock();
        if(compDB[b.getFieldValue("NAME")]){
            alert("Each component needs a unique name. You have more than one component named \"" + compDB[b.getFieldValue("NAME")] + "\".");
            return false;
        } else {
            compDB[b.getFieldValue("NAME")] = 1;
        }
        b = b.nextConnection;
    }


    // check output names
    for(var i = 0; i < block.outputCount; i++){
        if(block.getFieldValue("OUTPUT_NAME"+i).trim().length == 0){
            alert ("Give output " + (i+1) + " a name.");
            return false;
        }
        var output = block.getFieldValue("OUTPUT_NAME"+i).trim();
        if(outputDB[output]){
            alert("Each output needs a unique name. You have more than one output named \"" + output + "\".");
            outputDB = {};
            return false;
        } else {
            outputDB[output] = 1;
        }
    }

    // check inherited inputs
    var blocks = Blockly.getMainWorkspace().getAllBlocks();
    for(var i = 0; i < blocks.length; i++){
        if(blocks[i].type == "inherit_input"){
            var inin = blocks[i].getFieldValue("NAME");
            if(ininDB[inin]){
                alert("Each of the inherited inputs need a unique name. You have more than one inherited input named \"" + inin + "\".");
                ininDB = {};
                return false;
            } else {
                ininDB[inin] = 1;
            }
        }
    }

    // check if names are multiple words, start with numbers, and only have a-zA-z0-9_
    var al = "All component and output names have to follow C variable naming conventions. ";

    for(var v in compDB){
        if(compDB.hasOwnProperty(v)){
            if(v.split(/[ \t\n]+/).length > 1){
                alert(al + "Component names cannot contain spaces, tabs, or newlines. Rename component \""+ v +"\"");
                return false;
            }
            if(v.charAt(0)>= '0' && v.charAt(0)<= '9'){
                alert(al + "Component names cannot start with numbers. Rename component \""+ v +"\"");
                return false;
            }
            if(v.split(/[a-zA-Z0-9_]+/).join("").length > 0){
                alert(al + "Component names can only contain uppercase and lowercase letters, digits, and underscores. Rename component \""+ v +"\"");
                return false;
            }
        }
    }

    for(var v in outputDB){
        if(outputDB.hasOwnProperty(v)){
            if(v.split(/[ \t\n]+/).length > 1){
                alert(al + "Output names cannot contain spaces, tabs, or newlines. Rename output \""+ v +"\"");
                return false;
            }
            if(v.charAt(0)>= '0' && v.charAt(0)<= '9'){
                alert(al + "Output names cannot start with numbers. Rename output \""+ v +"\"");
                return false;
            }
            if(v.split(/[a-zA-Z0-9_]+/).join("").length > 0){
                alert(al + "Output names can only contain uppercase and lowercase letters, digits, and underscores. Rename output \""+ v +"\"");
                return false;
            }
        }
    }

    // =================check if all the inputs and outputs have ports==========
    for(var i = 0; i < block.outputCount; i++){
        if(!block.getInput("OUT"+i).connection.targetBlock()){
            alert("Assign a value to output \"" + block.getFieldValue("OUTPUT_NAME" + i) +"\".");
            return false;
        }
    }
    return true;
}

function exportCodeComp(){
    if(checkBlock()){
        var xhttp = new XMLHttpRequest();
        xhttp.name = "code";
        xhttp.open("POST", "export_builder/", true);
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                window.alert("Builder file created");
            }
        };
        var c = printYaml();
        console.log(c);
        xhttp.send(c);
    }
}

function printYaml() {
    var code = Blockly.Arduino.workspaceToCode(Blockly.getMainWorkspace());
    console.log(code);
    return code;
}

function getCode(){
    var xhttp = new XMLHttpRequest();
    xhttp.name = "code";
    xhttp.open("POST", "export_builder/", true);
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var c = printYaml().substring(34);
            var send = "get_zip_" + c.substring(0, c.indexOf("|")) + "/"
            window.location.assign(encodeURIComponent(send));
        }
    };
    var c = printYaml();
    console.log(c);
    xhttp.send(c);


}
