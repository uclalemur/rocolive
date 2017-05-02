var Toolbox = new Object();
Toolbox.sequence = {};
Toolbox.initToolbox = '<xml id="toolbox" style="display: none"></xml>';
Toolbox.toolboxParser = new DOMParser();
Toolbox.toolBoxTree = Toolbox.toolboxParser.parseFromString(Toolbox.initToolbox, "text/xml");
Toolbox.xmlTree = Toolbox.toolBoxTree.documentElement;

Toolbox.addBlock = function(block, category) {
    var blk = Toolbox.toolboxParser.parseFromString(block, "text/xml").documentElement;
    category.appendChild(blk);
};
Toolbox.updateToolbox = function() {
    workspace.updateToolbox(Toolbox.xmlTree);
};
Toolbox.disableBlock = function(blocks, category) {
    var ch = category.childNodes;
    for (var j = 0; j < ch.length; j++) {
        for (var i = 0; i < blocks.length; i++) {
            // console.log(ch[i].getAttribute("type"));
            if (ch[j].getAttribute("type") == blocks[i]) {
                ch[j].setAttribute("disabled", "true");
            }
        }
    }
};

Toolbox.deleteBlock = function(block, category) {
    var ch = category.childNodes;
    for (var j = 0; j < ch.length; j++) {
        if (ch[j].getAttribute("type") == block) {
            category.removeChild(ch[j]);
        }
    }
};

Toolbox.enableBlock = function(blocks, category) {
    var ch = category.childNodes;
    for (var j = 0; j < ch.length; j++) {
        for (var i = 0; i < blocks.length; i++) {
            // console.log(ch[i].getAttribute("type"));
            if (ch[j].getAttribute("type") == blocks[i]) {
                ch[j].setAttribute("disabled", "false");
            }
        }
    }
};
Toolbox.addCategory = function(category, superCategory) {
    var cat = Toolbox.toolboxParser.parseFromString(category, "text/xml").documentElement;
    superCategory.appendChild(cat);
    return cat;
};
Toolbox.addSeperationBefore = function(element, superElement) {
    var sep = Toolbox.toolboxParser.parseFromString("<sep></sep>", "text/xml").documentElement;
    superElement.insertBefore(sep, element);
};

var toolboxXML = Toolbox.toolBoxTree.documentElement;

//populate Toolbox with categories
Toolbox.addCategory('<category name="Logic" colour="210"></category>', toolboxXML);
Toolbox.addCategory('<category name="Loops" colour="120"></category>', toolboxXML);
Toolbox.addCategory('<category name="Math" colour="230"></category>', toolboxXML);
Toolbox.addCategory('<category name="Text" colour="160"></category>', toolboxXML);
Toolbox.addCategory('<category name="System" colour="260"></category>', toolboxXML);
// Toolbox.addCategory('<category name="Colour" colour="20"></category>', toolboxXML);
Toolbox.addCategory('<category name="Variables" colour="330"></category>', toolboxXML);
Toolbox.addCategory('<category name="Functions" colour="290" custom="PROCEDURE"></category>', toolboxXML);
Toolbox.addCategory('<category name="Component" colour="180"></category>', toolboxXML);


Toolbox.categories = toolboxXML.getElementsByTagName("category");

//populate Toolbox with seperators
Toolbox.addSeperationBefore(Toolbox.categories[5], toolboxXML);
Toolbox.addSeperationBefore(Toolbox.categories[7], toolboxXML);

//categories enumerated for readability
Toolbox.logicCategory = Toolbox.categories[0];

// Toolbox.disableBlock(["math_on_list"], Toolbox.mathCategory);

Toolbox.addBlock('<block type="controls_if"></block>', Toolbox.logicCategory);
Toolbox.addBlock('<block type="logic_compare"></block>', Toolbox.logicCategory);
Toolbox.addBlock('<block type="logic_operation"></block>', Toolbox.logicCategory);
Toolbox.addBlock('<block type="logic_negate"></block>', Toolbox.logicCategory);
Toolbox.addBlock('<block type="logic_null"></block>', Toolbox.logicCategory);
Toolbox.addBlock('<block type="logic_boolean"></block>', Toolbox.logicCategory);
Toolbox.addBlock('<block type="logic_ternary"></block>', Toolbox.logicCategory);

Toolbox.loopsCategory = Toolbox.categories[1];

Toolbox.addBlock('<block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value></block>', Toolbox.loopsCategory);
Toolbox.addBlock('<block type="controls_whileUntil"></block>', Toolbox.loopsCategory);
Toolbox.addBlock('<block type="controls_for"><value name="FROM"><shadow type="math_number"><field name="NUM">1</field></shadow></value><value name="TO"><shadow type="math_number"><field name="NUM">10</field></shadow></value><value name="BY"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block>', Toolbox.loopsCategory);
Toolbox.addBlock('<block type="controls_flow_statements"></block>', Toolbox.loopsCategory);

Toolbox.mathCategory = Toolbox.categories[2];

Toolbox.addBlock('<block type="math_number"></block>', Toolbox.mathCategory);
Toolbox.addBlock('<block type="math_arithmetic"><value name="A"><shadow type="math_number"><field name="NUM">1</field></shadow></value><value name="B"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block>', Toolbox.mathCategory);
Toolbox.addBlock('<block type="math_single"><value name="NUM"><shadow type="math_number"><field name="NUM">9</field></shadow></value></block>', Toolbox.mathCategory);
Toolbox.addBlock('<block type="math_trig"><value name="NUM"><shadow type="math_number"><field name="NUM">45</field></shadow></value></block>', Toolbox.mathCategory);
Toolbox.addBlock('<block type="math_constant"></block>', Toolbox.mathCategory);
Toolbox.addBlock('<block type="math_number_property"><value name="NUMBER_TO_CHECK"><shadow type="math_number"><field name="NUM">0</field></shadow></value></block>', Toolbox.mathCategory);
Toolbox.addBlock('<block type="math_change"><value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block>', Toolbox.mathCategory);
Toolbox.addBlock('<block type="math_round"><value name="NUM"><shadow type="math_number"><field name="NUM">3.1</field></shadow></value></block>', Toolbox.mathCategory);
// Toolbox.addBlock('<block type="math_on_list"></block>', Toolbox.mathCategory);
Toolbox.addBlock('<block type="math_modulo"><value name="DIVIDEND"><shadow type="math_number"><field name="NUM">64</field></shadow></value><value name="DIVISOR"><shadow type="math_number"><field name="NUM">10</field></shadow></value></block>', Toolbox.mathCategory);
Toolbox.addBlock('<block type="math_constrain"><value name="VALUE"><shadow type="math_number"><field name="NUM">50</field></shadow></value><value name="LOW"><shadow type="math_number"><field name="NUM">1</field></shadow></value><value name="HIGH"><shadow type="math_number"><field name="NUM">100</field></shadow></value></block>', Toolbox.mathCategory);
Toolbox.addBlock('<block type="math_random_int"><value name="FROM"><shadow type="math_number"><field name="NUM">1</field></shadow></value><value name="TO"><shadow type="math_number"><field name="NUM">100</field></shadow></value></block>', Toolbox.mathCategory);
Toolbox.addBlock('<block type="math_random_float"></block>', Toolbox.mathCategory);
// Toolbox.addBlock('<block type="base_map"></block>', Toolbox.mathCategory);

Toolbox.textCategory = Toolbox.categories[3];

Toolbox.addBlock('<block type="text"></block>', Toolbox.textCategory);
Toolbox.addBlock('<block type="text_join"></block>', Toolbox.textCategory);
Toolbox.addBlock('<block type="text_append"><value name="TEXT"><shadow type="text"></shadow></value></block>', Toolbox.textCategory);
Toolbox.addBlock('<block type="text_length"><value name="VALUE"><shadow type="text"><field name="TEXT">abc</field></shadow></value></block>', Toolbox.textCategory);
Toolbox.addBlock('<block type="text_isEmpty"><value name="VALUE"><shadow type="text"><field name="TEXT"></field></shadow></value></block>', Toolbox.textCategory);
// Toolbox.addBlock('<block type="text_indexOf"><value name="VALUE"><block type="variables_get"><field name="VAR">{textVariable}</field></block></value><value name="FIND"><shadow type="text"><field name="TEXT">abc</field></shadow></value></block>', Toolbox.textCategory);
// Toolbox.addBlock('<block type="text_charAt"><value name="VALUE"><block type="variables_get"><field name="VAR">{textVariable}</field></block></value></block>', Toolbox.textCategory);
// Toolbox.addBlock('<block type="text_getSubstring"><value name="STRING"><block type="variables_get"><field name="VAR">{textVariable}</field></block></value></block>', Toolbox.textCategory);
// Toolbox.addBlock('<block type="text_changeCase"><value name="TEXT"><shadow type="text"><field name="TEXT">abc</field></shadow></value></block>', Toolbox.textCategory);
// Toolbox.addBlock('<block type="text_trim"><value name="TEXT"><shadow type="text"><field name="TEXT">abc</field></shadow></value></block>', Toolbox.textCategory);
// Toolbox.addBlock('<block type="text_print"><value name="TEXT"><shadow type="text"><field name="TEXT">abc</field></shadow></value></block>', Toolbox.textCategory);
// Toolbox.addBlock('<block type="text_prompt_ext"><value name="TEXT"><shadow type="text"><field name="TEXT">abc</field></shadow></value></block>', Toolbox.textCategory);

// Toolbox.disableBlock(["text_indexOf", "text_charAt", "text_getSubstring", "text_changeCase", "text_trim", "text_print", "text_prompt_ext"], Toolbox.textCategory);


Toolbox.systemsCategory = Toolbox.categories[4];
Toolbox.addBlock('<block type="delay"><value name="TIME"><shadow type="math_number"><field name="NUM">1000</field></shadow></value></block>', Toolbox.systemsCategory);
Toolbox.addBlock('<block type="time"></block>', Toolbox.systemsCategory);
// Toolbox.addBlock('<block type="lists_create_with"><mutation items="0"></mutation></block>', Toolbox.listsCategory);
// Toolbox.addBlock('<block type="lists_create_with"></block>', Toolbox.listsCategory);
// Toolbox.addBlock('<block type="lists_repeat"><value name="NUM"><shadow type="math_number"><field name="NUM">5</field></shadow></value></block>', Toolbox.listsCategory);
// Toolbox.addBlock('<block type="lists_length"></block>', Toolbox.listsCategory);
// Toolbox.addBlock('<block type="lists_isEmpty"></block>', Toolbox.listsCategory);
// Toolbox.addBlock('<block type="lists_indexOf"><value name="VALUE"><block type="variables_get"><field name="VAR">{listVariable}</field></block></value></block>', Toolbox.listsCategory);
// Toolbox.addBlock('<block type="lists_getIndex"><value name="VALUE"><block type="variables_get"><field name="VAR">{listVariable}</field></block></value></block>', Toolbox.listsCategory);
// Toolbox.addBlock('<block type="lists_setIndex"><value name="LIST"><block type="variables_get"><field name="VAR">{listVariable}</field></block></value></block>', Toolbox.listsCategory);
// Toolbox.addBlock('<block type="lists_getSublist"><value name="LIST"><block type="variables_get"><field name="VAR">{listVariable}</field></block></value></block>', Toolbox.listsCategory);
// Toolbox.addBlock('<block type="lists_split"><value name="DELIM"><shadow type="text"><field name="TEXT">,</field></shadow></value></block>', Toolbox.listsCategory);
// Toolbox.addBlock('<block type="lists_sort"></block>', Toolbox.listsCategory);

// Toolbox.disableBlock(["lists_create_with", "lists_create_with", "lists_repeat", "lists_length", "lists_isEmpty", "lists_indexOf", "lists_getIndex", "lists_setIndex", "lists_getSublist", "lists_split", "lists_sort"], Toolbox.listsCategory);


// Toolbox.colourCategory = Toolbox.categories[4];
//
// Toolbox.addBlock('<block type="colour_picker"></block>', Toolbox.colourCategory);
// Toolbox.addBlock('<block type="colour_random"></block>', Toolbox.colourCategory);
// Toolbox.addBlock('<block type="colour_rgb"><value name="RED"><shadow type="math_number"><field name="NUM">100</field></shadow></value><value name="GREEN"><shadow type="math_number"><field name="NUM">50</field></shadow></value><value name="BLUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value></block>', Toolbox.colourCategory);
// Toolbox.addBlock('<block type="colour_blend"><value name="COLOUR1"><shadow type="colour_picker"><field name="COLOUR">#ff0000</field></shadow></value><value name="COLOUR2"><shadow type="colour_picker"><field name="COLOUR">#3333ff</field></shadow></value><value name="RATIO"><shadow type="math_number"><field name="NUM">0.5</field></shadow></value></block>', Toolbox.colourCategory);

Toolbox.variableCategory = Toolbox.categories[5];

Toolbox.addBlock('<block type="variables_get"></block>', Toolbox.variableCategory);
Toolbox.addBlock('<block type="variables_set"></block>', Toolbox.variableCategory);
Toolbox.addBlock('<block type="variables_set"><value name="VALUE"><block type="variables_set_type"></block></value></block>', Toolbox.variableCategory);
Toolbox.addBlock('<block type="variables_set_type"></block>', Toolbox.variableCategory);

Toolbox.componentCategory = Toolbox.categories[7];
