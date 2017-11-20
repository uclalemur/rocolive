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
    code += "##";
    code += Blockly.Arduino.statementToCode(this, "LOOP");
    code += "##";

    for(var i = 0; i < this.outputCount; i++)
        code += this.getFieldValue("OUTPUT_NAME" + i) + getActiveTab().mangler + "|" + Blockly.Arduino.valueToCode(this, "OUT"+i) + '|' + Blockly.Arduino.valueToCode(this, "OUT_PORT" + i, Blockly.Arduino.ORDER_ATOMIC) + "|";
    for(var i = 0; i < this.inputCount; i++)
        code += this.getFieldValue("INPUT_NAME" + i) + getActiveTab().mangler + "%" + Blockly.Arduino.valueToCode(this, "INP_PORT" + i, Blockly.Arduino.ORDER_ATOMIC) + "^";
    for(var i = 0; i < this.parameterCount; i++)
        code += this.getFieldValue("PAR_NAME" + i) + getActiveTab().mangler + "$" + this.getFieldValue("PAR_VAL" + i) + "$";

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
        code += this.getFieldValue("OUTPUT_NAME" + i) + getActiveTab().mangler + "|" + Blockly.Python.valueToCode(this, "OUT"+i) + '|' + Blockly.Python.valueToCode(this, "OUT_PORT" + i, Blockly.Python.ORDER_ATOMIC) + "|";
    for(var i = 0; i < this.inputCount; i++)
        code += this.getFieldValue("INPUT_NAME" + i) + getActiveTab().mangler + "%" + Blockly.Python.valueToCode(this, "INP_PORT" + i, Blockly.Python.ORDER_ATOMIC) + "^";
    for(var i = 0; i < this.parameterCount; i++)
        code += this.getFieldValue("PAR_NAME" + i) + getActiveTab().mangler + "$" + this.getFieldValue("PAR_VAL" + i) + "$";

    return code;
}

Blockly.Arduino.comp_component_create = function() {
    var code = '';
    code += (this.getFieldValue("NAME") + "|");
    code += Blockly.Arduino.statementToCode(this, "CODE");


    for(var i =0; i < this.outputCount; i++){
        code += Blockly.Arduino.valueToCode(this, "OUT" + i) + this.getFieldValue("OUTPUT_NAME"+i) + "^";
    }
    return [code, Blockly.Arduino.ORDER_NONE]
}

function checkPrevBlock(){
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

function checkBaseBlock(){
    var inputDB = {};
    var outputDB = {};
    var paramDB = {};
    // get block
    var block = getActiveTab().workspace.getAllBlocks()[0];

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

function getJSON() {
    /*
    out {
        name: "hello"
        blocks [
            name: "n",
            inputs [
                {
                    inherited: false
                    name: "input_name",
                    source_name: "received",
                    source_comp: "sIn"
                },
                {
                    inherited: true
                    name: "input_name",
                    source_name: block.input_name,
                    source_comp: block
                }
            ]
        ]
        output [
            {
                name: "output_name",
                source_name: "received",
                source_comp: "sIn"
            }
        ]
    }
    */
    var blocks = Blockly.getMainWorkspace().getTopBlocks();
    var top;
    for(var i = 0; i < blocks.length; i++){
        if(blocks[i].type == "comp_component_create"){
            top = blocks[i];
            break;
        }
    }
    var out = {};
    out['name'] = top.getFieldValue('NAME');
    out.blocks = [];
    var block = top.getChildren()[0];
    for(; block != null; block = block.nextConnection.targetBlock()){
        var b = {};
        b['name'] = block.getFieldValue("NAME");
        b['type'] = block.type.substring(0, block.type.lastIndexOf(getActiveTabNum()));
        b['inputs'] = [];
        for(var i = 0; i < block.inputs.length; i++){
            if(block.getInputTargetBlock(block.inputs[i])){
                var input = {};
                input['name'] = block.inputs[i];
                if(block.getInputTargetBlock(block.inputs[i]).type == "inherit_input"){
                    input['inherited'] = true;
                    input['source_name'] = block.inputs[i];;
                    input['source_comp'] = b['name'];
                } else {
                    input['inherited'] = false;
                    var n = block.getInputTargetBlock(block.inputs[i]).getInput("NAME").fieldRow[0].getText();
                    input['source_name'] = n.substring(n.lastIndexOf(" ->") + 4);
                    input['source_comp'] = n.substring(0, n.lastIndexOf(" -> "));
                }
                b['inputs'].push(input);
            }
        }
        out.blocks.push(b);
    }
    block = top;
    out['outputs'] = [];
    for(var i = 0; block.getInputTargetBlock("OUT" + i) != null; i++){
        b = {};
        b['name'] = block.getFieldValue("OUTPUT_NAME"+i);
        var n = block.getInputTargetBlock("OUT" + i).getInput("NAME").fieldRow[0].getText();
        b['source_name'] = n.substring(n.lastIndexOf(" ->") + 4);
        b['source_comp'] = n.substring(0, n.lastIndexOf(" -> "));
        out['outputs'].push(b);
    }
    return JSON.stringify(out);
}

function getBaseCode(){
    var code = {};
    var mainBlock = null;
    for(var i = 0; i < Blockly.getMainWorkspace().getTopBlocks().length; i++){
        if(Blockly.getMainWorkspace().getTopBlocks()[i].type == "component_create"){
            mainBlock = Blockly.getMainWorkspace().getTopBlocks()[i];
            break;
        }
    }
    if(mainBlock == null){
        window.alert("No top level Block found :(\n");
        return;
    }
    code.name = mainBlock.getFieldValue("NAME");
    code.arduino = {};
    ard = code.arduino;
    ard.setup = Blockly.Arduino.statementToCode(Blockly.getMainWorkspace().getTopBlocks()[0], "SETUP", Blockly.Arduino.ORDER_NONE);
    ard.loop = Blockly.Arduino.statementToCode(Blockly.getMainWorkspace().getTopBlocks()[0], "LOOP", Blockly.Arduino.ORDER_NONE);
    


    try{
        Blockly.Arduino.workspaceToCode(getActiveTab().workspace);
    } catch(err){
        console.log(err);
        window.alert("Please remove all blocks which are not arduino compatible. These are the ones that are disabled in the toolbar.");
    }

    ard.vars = [];
    ard.decl = [];
    var vars = Blockly.Arduino.definitions_.variables.split("\n");
    for(var i = 0; i < vars.length; i++){
        if(vars[i].length > 0){
            v = {}
            v.type = vars[i].split(" ")[0];
            v.name = vars[i].split(" ")[1].substring(0, vars[i].split(" ")[1].length-1);
            ard.decl.push(vars[i]);
            ard.vars.push(v);
        }
    }

    ard.functions = [];
    for(var name in Blockly.Arduino.definitions_){
        if(name == "variables")
            continue;

        func = {};
        var lines = Blockly.Arduino.definitions_[name].split("\n");
        for(var i = 0; i < lines.length; i++){
            if(!(lines[i][0] == '/' && lines[i][1] == '/')){
                if(lines[i].includes('(') && lines[i].includes(')')){
                    var tokens = lines[i].split(" ");
                    func.ret = tokens[0];
                    func.name = tokens[1].substring(0, tokens[1].indexOf('('));
                    func.mangled = func.name + "@@name@@";
                    func.decl = lines[i].substring(0, lines[i].length-1).replace(func.name, func.mangled)+';';
                    ard.decl.push(func.decl);
                }
            }
        }
        func.code = Blockly.Arduino.definitions_[name];
        func.mangled_code = func.code.replace(func.name, func.mangled);
        ard.functions.push(func);
    }
    ard.inputs = [];

    for(var i = 0; mainBlock.getInput("INP_PORT"+i); i++){
        var input = {};
        input.name = mainBlock.getFieldValue("INPUT_NAME" + i);
        input.port = Blockly.Arduino.valueToCode(mainBlock, "INP_PORT" + i, Blockly.Arduino.ORDER_ATOMIC);
        input.mangled = input.name + "@@name@@";
        ard.inputs.push(input);
    }

    ard.params = [];
    for(var i = 0; mainBlock.getField("PAR_NAME"+i); i++){
        var param = {};
        param.name = mainBlock.getFieldValue("PAR_NAME" + i);
        param.value = mainBlock.getFieldValue("PAR_VAL" + i);
        param.mangled = param.name + "@@name@@";
        ard.params.push(param);
    }

    ard.outputs = [];
    for(var i = 0; mainBlock.getInput("OUT_PORT"+i); i++){
        var output = {};
        output.name = mainBlock.getFieldValue("OUTPUT_NAME" + i);
        output.port = Blockly.Arduino.valueToCode(mainBlock, "OUT_PORT" + i, Blockly.Arduino.ORDER_ATOMIC);
        output.mangled = output.name + "@@name@@";
        output.code = Blockly.Arduino.valueToCode(mainBlock, "OUT"+i)
        ard.outputs.push(output);
    }
    console.log(code)
    return JSON.stringify(code);
    
}

function exportCode(event){
    if (getActiveTab().type == "bc"){
        if(checkBaseBlock()){
            var xhttp = new XMLHttpRequest();
            xhttp.name = "code";
            xhttp.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    window.alert("Component Created");
                }
            };
            var c = getBaseCode();
            console.log(c);
            xhttp.open("POST", "/api/component/export_code/", true);
            xhttp.send(c);
        }
    } else if (getActiveTab().type == "cc"){
        if(checkPrevBlock()){
            var xhttp = new XMLHttpRequest();
            xhttp.name = "code";
            xhttp.open("POST", "/api/component/export_builder/", true);
            xhttp.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    window.alert("Builder file created");
                }
            };
            var c = getJSON();
            console.log(c);
            xhttp.send(c);
        }
    }
    
}
