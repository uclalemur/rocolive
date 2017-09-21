function getCode(){
    var code;
    try{
        code = Blockly.Arduino.workspaceToCode(Blockly.getMainWorkspace());
        console.log(code);
        console.log(Blockly.Python.workspaceToCode(Blockly.getMainWorkspace()));
        code += ("\n...---...\n" + Blockly.Python.workspaceToCode(Blockly.getMainWorkspace()));
        return code;
    } catch(err){
        console.log(err);
        window.alert("Please remove all blocks which are not arduino compatible. These are the ones that are disabled in the toolbar.");
    }
}

Blockly.Arduino.delay = function(){
    var code = '';
    code += "delay( " + Blockly.Arduino.valueToCode(this, 'TIME', Blockly.Arduino.ORDER_ATOMIC) + " );\n"
    return code;
}

Blockly.Arduino.time = function(){
    var code = 'millis();\n';
    return code;
}

Blockly.Python.delay = function() {
    var code = 'import time\n';
    code += "time.sleep( " + Blockly.Arduino.valueToCode(this, 'TIME', Blockly.Arduino.ORDER_ATOMIC) + "/1000. )\n"
    return code;
}

Blockly.Arduino.component_create = function() {
    var code = '';
    code += (this.getFieldValue("NAME") + "|");

    var portSet = {};

    for(var i =0; i < this.inputCount; i++){
        var port= Blockly.Arduino.valueToCode(this, "INP_PORT" + i, Blockly.Arduino.ORDER_ATOMIC);
        if(portSet[port]){
            portSet[port]++;
        } else{
            portSet[port] = 1;
        }
    }

    for(var i =0; i < this.outputCount; i++){
        var port= Blockly.Arduino.valueToCode(this, "OUT_PORT" + i, Blockly.Arduino.ORDER_ATOMIC);
        if(portSet[port]){
            portSet[port]++;
        } else{
            portSet[port] = 1;
        }
    }

    var size = 0;
    var p = "";

    for(var port in portSet){
        size++;
        p += (port + "\\" + portSet[port] + "|");
    }

    code += (size + "|");
    code += p;

    code += "##";
    code += Blockly.Arduino.statementToCode(this, "SETUP");
    console.log(this.parameterCount);
    code += "##";
    code += Blockly.Arduino.statementToCode(this, "LOOP");
    code += "##";

    for(var i = 0; i < this.outputCount; i++)
        code += this.getFieldValue("OUTPUT_NAME" + i) + mangler + "|" + Blockly.Arduino.valueToCode(this, "OUT"+i) + '|' + Blockly.Arduino.valueToCode(this, "OUT_PORT" + i, Blockly.Arduino.ORDER_ATOMIC) + "|";
    for(var i = 0; i < this.inputCount; i++)
        code += this.getFieldValue("INPUT_NAME" + i) + mangler + "%" + Blockly.Arduino.valueToCode(this, "INP_PORT" + i, Blockly.Arduino.ORDER_ATOMIC) + "^";
    for(var i = 0; i < this.parameterCount; i++)
        code += this.getFieldValue("PAR_NAME" + i) + mangler + "$" + this.getFieldValue("PAR_VAL" + i) + "$";

    console.log(code);
    return code;
}

Blockly.Python.component_create = function() {
    var code = '';
    code += (this.getFieldValue("NAME") + "|");

    var portSet = {};

    for(var i =0; i < this.inputCount; i++){
        var port= Blockly.Python.valueToCode(this, "INP_PORT" + i, Blockly.Python.ORDER_ATOMIC);
        if(portSet[port]){
            portSet[port]++;
        } else{
            portSet[port] = 1;
        }
    }

    for(var i =0; i < this.outputCount; i++){
        var port= Blockly.Python.valueToCode(this, "OUT_PORT" + i, Blockly.Python.ORDER_ATOMIC);
        if(portSet[port]){
            portSet[port]++;
        } else{
            portSet[port] = 1;
        }
    }

    var size = 0;
    var p = "";

    for(var port in portSet){
        size++;
        p += (port + "\\" + portSet[port] + "|");
    }

    code += (size + "|");
    code += p;

    code += "##";
    code += Blockly.Python.statementToCode(this, "CODE");
    console.log(this.parameterCount);
    code += "##";

    for(var i = 0; i < this.outputCount; i++)
        code += this.getFieldValue("OUTPUT_NAME" + i) + mangler + "|" + Blockly.Python.valueToCode(this, "OUT"+i) + '|' + Blockly.Python.valueToCode(this, "OUT_PORT" + i, Blockly.Python.ORDER_ATOMIC) + "|";
    for(var i = 0; i < this.inputCount; i++)
        code += this.getFieldValue("INPUT_NAME" + i) + mangler + "%" + Blockly.Python.valueToCode(this, "INP_PORT" + i, Blockly.Python.ORDER_ATOMIC) + "^";
    for(var i = 0; i < this.parameterCount; i++)
        code += this.getFieldValue("PAR_NAME" + i) + mangler + "$" + this.getFieldValue("PAR_VAL" + i) + "$";

    return code;
}


function checkBlock(){
    var inputDB = {};
    var outputDB = {};
    var paramDB = {};
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

    // check input names
    for(var i = 0; i < block.inputCount; i++){
        if(block.getFieldValue("INPUT_NAME"+i).trim().length == 0){
            alert ("Give input " + (i+1) + " a name.");
            return false;
        }
        var input = block.getFieldValue("INPUT_NAME"+i).trim();
        if(inputDB[input]){
            alert("Each input needs a unique name. You have two inputs named \"" + input + "\".");
            inputDB = {};
            return false;
        } else {
            inputDB[input] = 1;
        }
    }

    // check output names
    for(var i = 0; i < block.outputCount; i++){
        if(block.getFieldValue("OUTPUT_NAME"+i).trim().length == 0){
            alert ("Give output " + (i+1) + " a name.");
            return false;
        }
        var output = block.getFieldValue("OUTPUT_NAME"+i).trim();
        if(outputDB[output]){
            alert("Each output needs a unique name. You have two outputs named \"" + output + "\".");
            outputDB = {};
            return false;
        } else {
            outputDB[output] = 1;
        }
    }

    // check parameter names
    for(var i = 0; i < block.parameterCount; i++){
        if(block.getFieldValue("PAR_NAME"+i).trim().length == 0){
            alert ("Give parameter " + (i+1) + " a name.");
            return false;
        }
        var param = block.getFieldValue("PAR_NAME"+i).trim();
        if(paramDB[param]){
            alert("Each parameter needs a unique name. You have two parameters named \"" + param + "\".");
            paramDB = {};
            return false;
        } else {
            paramDB[param] = 1;
        }
    }

    // check if names are multiple words, start with numbers, and only have a-zA-z0-9_
    var al = "All input, output, and parameter names have to follow C variable naming conventions. ";
    for(var v in inputDB){
        if(inputDB.hasOwnProperty(v)){
            if(v.split(/[ \t\n]+/).length > 1){
                alert(al + "Input names cannot contain spaces, tabs, or newlines. Rename input \""+ v +"\"");
                return false;
            }
            if(v.charAt(0)>= '0' && v.charAt(0)<= '9'){
                alert(al + "Input names cannot start with numbers. Rename input \""+ v +"\"");
                return false;
            }
            if(v.split(/[a-zA-Z0-9_]+/).join("").length > 0){
                alert(al + "Input names can only contain uppercase and lowercase letters, digits, and underscores. Rename input \""+ v +"\"");
                return false;
            }
        }
    }

    for(var v in outputDB){
        if(outputDB.hasOwnProperty(v)){
            if(v.split(/[ \t\n]+/).length > 1){
                alert(al + "output names cannot contain spaces, tabs, or newlines. Rename output \""+ v +"\"");
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

    for(var v in paramDB){
        if(paramDB.hasOwnProperty(v)){
            if(v.split(/[ \t\n]+/).length > 1){
                alert(al + "Parameter names cannot contain spaces, tabs, or newlines. Rename parameter \""+ v +"\"");
                return false;
            }
            if(v.charAt(0)>= '0' && v.charAt(0)<= '9'){
                alert(al + "Parameter names cannot start with numbers. Rename parameter \""+ v +"\"");
                return false;
            }
            if(v.split(/[a-zA-Z0-9_]+/).join("").length > 0){
                alert(al + "Parameter names can only contain uppercase and lowercase letters, digits, and underscores. Rename parameter \""+ v +"\"");
                return false;
            }
        }
    }

    // =================check if all the inputs and outputs have ports==========
    for(var i = 0; i < block.inputCount; i++){
        if(!block.getInput("INP_PORT"+i).connection.targetBlock()){
            alert("Add a port to input \"" + block.getFieldValue("INPUT_NAME" + i) +"\".");
            return false;
        }
    }
    for(var i = 0; i < block.parameterCount; i++){
        if(block.getFieldValue("PAR_VAL" + i).trim() == "default value"){
            alert ("Assign a default value to parameter \"" + block.getFieldValue("PAR_NAME" + i) +"\".");
            return false;
        }
    }

    for(var i = 0; i < block.outputCount; i++){
        if(!block.getInput("OUT"+i).connection.targetBlock()){
            alert("Assign a value to output \"" + block.getFieldValue("OUTPUT_NAME" + i) +"\".");
            return false;
        }
        if(!block.getInput("OUT_PORT"+i).connection.targetBlock()){
            alert("Add a port to output \"" + block.getFieldValue("OUTPUT_NAME" + i) +"\".");
            return false;
        }
    }
    return true;
}

function exportCode(){
    if(checkBlock()){
        var xhttp = new XMLHttpRequest();
        xhttp.name = "code";
        xhttp.open("POST", "export_code/", true);
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                window.alert("Component Created");
            }
        };
        var c = getCode();
        console.log(c);
        xhttp.send(c);
    }
}
