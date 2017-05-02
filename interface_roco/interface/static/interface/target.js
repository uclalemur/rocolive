// var target = "";
// targetNone();
// document.getElementById("target").innerHTML = "Target: " + target;

function targetRP(){
    target = "Raspberry Pi";
    document.getElementById("target").innerHTML = "Target: " + target;
}

function targetArd(){
    try{
        Blockly.Arduino.workspaceToCode(Blockly.getMainWorkspace());
    } catch(err){
        window.alert("Please remove all blocks which are not arduino compatible. These are the ones that are disabled in the toolbar.");
    }
    target = "Arduino";
    document.getElementById("target").innerHTML = "Target: " + target;

    Toolbox.disableBlock(["math_on_list"], Toolbox.mathCategory);
    Toolbox.disableBlock(["text_indexOf", "text_charAt", "text_getSubstring", "text_changeCase", "text_trim", "text_print", "text_prompt_ext"], Toolbox.textCategory);
    Toolbox.disableBlock(["lists_create_with", "lists_create_with", "lists_repeat", "lists_length", "lists_isEmpty", "lists_indexOf", "lists_getIndex", "lists_setIndex", "lists_getSublist", "lists_split", "lists_sort"], Toolbox.listsCategory);
    Toolbox.enableBlock(["base_map"], Toolbox.mathCategory);
    workspace.updateToolbox(Toolbox.xmlTree);
}

function targetNone(){
    target = "None";
    document.getElementById("target").innerHTML = "Target: " + target;
    Toolbox.enableBlock(["controls_if", "logic_compare", "logic_operation", "logic_negate", "logic_null", "logic_boolean", "logic_ternary"], Toolbox.logicCategory);
    Toolbox.enableBlock(["controls_repeat_ext", "controls_whileUntil", "controls_for", "controls_flow_statements"], Toolbox.loopsCategory);
    Toolbox.enableBlock(["math_number", "math_arithmetic", "math_single", "math_trig", "math_constant", "math_number_property", "math_change", "math_round", "math_on_list", "math_modulo", "math_constrain", "math_random_int", "math_random_float"], Toolbox.mathCategory);
    Toolbox.enableBlock(["text", "text_join", "text_append", "text_length", "text_isEmpty", "text_indexOf", "text_charAt", "text_getSubstring", "text_changeCase", "text_trim", "text_print", "text_prompt_ext"], Toolbox.textCategory);
    Toolbox.enableBlock(["lists_create_with", "lists_create_with", "lists_repeat", "lists_length", "lists_isEmpty", "lists_indexOf", "lists_getIndex", "lists_setIndex", "lists_getSublist", "lists_split", "lists_sort"], Toolbox.listsCategory);
    Toolbox.enableBlock(["colour_picker", "colour_random", "colour_rgb", "colour_blend"], Toolbox.colourCategory);
    Toolbox.disableBlock(["base_map"], Toolbox.mathCategory);
    workspace.updateToolbox(Toolbox.xmlTree);
}
