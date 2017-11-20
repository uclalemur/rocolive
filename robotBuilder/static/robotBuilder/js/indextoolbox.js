function createToolbox(tab){
    tab.Toolbox = new Object();
    tab.Toolbox.sequence = {};
    tab.Toolbox.initToolbox = '<xml id="toolbox" style="display: none"></xml>';
    tab.Toolbox.toolboxParser = new DOMParser();
    tab.Toolbox.toolBoxTree = tab.Toolbox.toolboxParser.parseFromString(tab.Toolbox.initToolbox, "text/xml");
    tab.Toolbox.xmlTree = tab.Toolbox.toolBoxTree.documentElement;

    tab.Toolbox.addBlock = function(block, category) {
        var blk = tab.Toolbox.toolboxParser.parseFromString(block, "text/xml").documentElement;
        category.appendChild(blk);
    };
    tab.Toolbox.updateToolbox = function() {
        tab.workspace.updateToolbox(tab.Toolbox.xmlTree);
    };
    tab.Toolbox.disableBlock = function(blocks, category) {
        var ch = category.childNodes;
        for (var j = 0; j < ch.length; j++) {
            for (var i = 0; i < blocks.length; i++) {
                if (ch[j].getAttribute("type") == blocks[i]) {
                    ch[j].setAttribute("disabled", "true");
                }
            }
        }
    };

    tab.Toolbox.deleteBlock = function(block, category) {
        var ch = category.childNodes;
        for (var j = 0; j < ch.length; j++) {
            if (ch[j].getAttribute("type") == block) {
                category.removeChild(ch[j]);
            }
        }
    };

    tab.Toolbox.enableBlock = function(blocks, category) {
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
    tab.Toolbox.addCategory = function(category, superCategory) {
        var cat = tab.Toolbox.toolboxParser.parseFromString(category, "text/xml").documentElement;
        superCategory.appendChild(cat);
        return cat;
    };
    tab.Toolbox.addSeperationBefore = function(element, superElement) {
        var sep = tab.Toolbox.toolboxParser.parseFromString("<sep></sep>", "text/xml").documentElement;
        superElement.insertBefore(sep, element);
    };

    tab.toolboxXML = tab.Toolbox.toolBoxTree.documentElement;

    //populate Toolbox with categories
    tab.Toolbox.addCategory('<category name="Logic" colour="210"></category>', tab.toolboxXML);
    tab.Toolbox.addCategory('<category name="Loops" colour="120"></category>', tab.toolboxXML);
    tab.Toolbox.addCategory('<category name="Math" colour="230"></category>', tab.toolboxXML);
    tab.Toolbox.addCategory('<category name="Text" colour="160"></category>', tab.toolboxXML);
    tab.Toolbox.addCategory('<category name="System" colour="260"></category>', tab.toolboxXML);
    // Toolbox.addCategory('<category name="Colour" colour="20"></category>', tab.toolboxXML);
    tab.Toolbox.addCategory('<category name="Variables" colour="330"></category>', tab.toolboxXML);
    tab.Toolbox.addCategory('<category name="Functions" colour="290" custom="PROCEDURE"></category>', tab.toolboxXML);
    tab.Toolbox.addCategory('<category name="Component" colour="180"></category>', tab.toolboxXML);


    tab.Toolbox.categories = tab.toolboxXML.getElementsByTagName("category");

    //populate Toolbox with seperators
    tab.Toolbox.addSeperationBefore(tab.Toolbox.categories[5], tab.toolboxXML);
    tab.Toolbox.addSeperationBefore(tab.Toolbox.categories[7], tab.toolboxXML);

    //categories enumerated for readability
    tab.Toolbox.logicCategory = tab.Toolbox.categories[0];

    // Toolbox.disableBlock(["math_on_list"], Toolbox.mathCategory);

    tab.Toolbox.addBlock('<block type="controls_if"></block>', tab.Toolbox.logicCategory);
    tab.Toolbox.addBlock('<block type="logic_compare"></block>', tab.Toolbox.logicCategory);
    tab.Toolbox.addBlock('<block type="logic_operation"></block>', tab.Toolbox.logicCategory);
    tab.Toolbox.addBlock('<block type="logic_negate"></block>', tab.Toolbox.logicCategory);
    tab.Toolbox.addBlock('<block type="logic_null"></block>', tab.Toolbox.logicCategory);
    tab.Toolbox.addBlock('<block type="logic_boolean"></block>', tab.Toolbox.logicCategory);
    tab.Toolbox.addBlock('<block type="logic_ternary"></block>', tab.Toolbox.logicCategory);

    tab.Toolbox.loopsCategory = tab.Toolbox.categories[1];

    // tab.Toolbox.addBlock('<block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value></block>', tab.Toolbox.loopsCategory);
    tab.Toolbox.addBlock('<block type="controls_whileUntil"></block>', tab.Toolbox.loopsCategory);
    tab.Toolbox.addBlock('<block type="controls_for"><value name="FROM"><shadow type="math_number"><field name="NUM">1</field></shadow></value><value name="TO"><shadow type="math_number"><field name="NUM">10</field></shadow></value><value name="BY"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block>', tab.Toolbox.loopsCategory);
    tab.Toolbox.addBlock('<block type="controls_flow_statements"></block>', tab.Toolbox.loopsCategory);

    tab.Toolbox.mathCategory = tab.Toolbox.categories[2];

    tab.Toolbox.addBlock('<block type="math_number"></block>', tab.Toolbox.mathCategory);
    tab.Toolbox.addBlock('<block type="math_arithmetic"><value name="A"><shadow type="math_number"><field name="NUM">1</field></shadow></value><value name="B"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block>', tab.Toolbox.mathCategory);
    tab.Toolbox.addBlock('<block type="math_single"><value name="NUM"><shadow type="math_number"><field name="NUM">9</field></shadow></value></block>', tab.Toolbox.mathCategory);
    tab.Toolbox.addBlock('<block type="math_trig"><value name="NUM"><shadow type="math_number"><field name="NUM">45</field></shadow></value></block>', tab.Toolbox.mathCategory);
    tab.Toolbox.addBlock('<block type="math_constant"></block>', tab.Toolbox.mathCategory);
    tab.Toolbox.addBlock('<block type="math_number_property"><value name="NUMBER_TO_CHECK"><shadow type="math_number"><field name="NUM">0</field></shadow></value></block>', tab.Toolbox.mathCategory);
    tab.Toolbox.addBlock('<block type="math_change"><value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block>', tab.Toolbox.mathCategory);
    tab.Toolbox.addBlock('<block type="math_round"><value name="NUM"><shadow type="math_number"><field name="NUM">3.1</field></shadow></value></block>', tab.Toolbox.mathCategory);
    // tab.Toolbox.addBlock('<block type="math_on_list"></block>', tab.Toolbox.mathCategory);
    tab.Toolbox.addBlock('<block type="math_modulo"><value name="DIVIDEND"><shadow type="math_number"><field name="NUM">64</field></shadow></value><value name="DIVISOR"><shadow type="math_number"><field name="NUM">10</field></shadow></value></block>', tab.Toolbox.mathCategory);
    tab.Toolbox.addBlock('<block type="math_constrain"><value name="VALUE"><shadow type="math_number"><field name="NUM">50</field></shadow></value><value name="LOW"><shadow type="math_number"><field name="NUM">1</field></shadow></value><value name="HIGH"><shadow type="math_number"><field name="NUM">100</field></shadow></value></block>', tab.Toolbox.mathCategory);
    tab.Toolbox.addBlock('<block type="math_random_int"><value name="FROM"><shadow type="math_number"><field name="NUM">1</field></shadow></value><value name="TO"><shadow type="math_number"><field name="NUM">100</field></shadow></value></block>', tab.Toolbox.mathCategory);
    tab.Toolbox.addBlock('<block type="math_random_float"></block>', tab.Toolbox.mathCategory);
    // tab.Toolbox.addBlock('<block type="base_map"></block>', tab.Toolbox.mathCategory);

    tab.Toolbox.textCategory = tab.Toolbox.categories[3];

    tab.Toolbox.addBlock('<block type="text"></block>', tab.Toolbox.textCategory);
    tab.Toolbox.addBlock('<block type="text_join"></block>', tab.Toolbox.textCategory);
    tab.Toolbox.addBlock('<block type="text_append"><value name="TEXT"><shadow type="text"></shadow></value></block>', tab.Toolbox.textCategory);
    tab.Toolbox.addBlock('<block type="text_length"><value name="VALUE"><shadow type="text"><field name="TEXT">abc</field></shadow></value></block>', tab.Toolbox.textCategory);
    tab.Toolbox.addBlock('<block type="text_isEmpty"><value name="VALUE"><shadow type="text"><field name="TEXT"></field></shadow></value></block>', tab.Toolbox.textCategory);
    // tab.Toolbox.addBlock('<block type="text_indexOf"><value name="VALUE"><block type="variables_get"><field name="VAR">{textVariable}</field></block></value><value name="FIND"><shadow type="text"><field name="TEXT">abc</field></shadow></value></block>', tab.Toolbox.textCategory);
    // tab.Toolbox.addBlock('<block type="text_charAt"><value name="VALUE"><block type="variables_get"><field name="VAR">{textVariable}</field></block></value></block>', tab.Toolbox.textCategory);
    // tab.Toolbox.addBlock('<block type="text_getSubstring"><value name="STRING"><block type="variables_get"><field name="VAR">{textVariable}</field></block></value></block>', tab.Toolbox.textCategory);
    // tab.Toolbox.addBlock('<block type="text_changeCase"><value name="TEXT"><shadow type="text"><field name="TEXT">abc</field></shadow></value></block>', tab.Toolbox.textCategory);
    // tab.Toolbox.addBlock('<block type="text_trim"><value name="TEXT"><shadow type="text"><field name="TEXT">abc</field></shadow></value></block>', tab.Toolbox.textCategory);
    // tab.Toolbox.addBlock('<block type="text_print"><value name="TEXT"><shadow type="text"><field name="TEXT">abc</field></shadow></value></block>', tab.Toolbox.textCategory);
    // tab.Toolbox.addBlock('<block type="text_prompt_ext"><value name="TEXT"><shadow type="text"><field name="TEXT">abc</field></shadow></value></block>', tab.Toolbox.textCategory);

    // tab.Toolbox.disableBlock(["text_indexOf", "text_charAt", "text_getSubstring", "text_changeCase", "text_trim", "text_print", "text_prompt_ext"], tab.Toolbox.textCategory);


    tab.Toolbox.systemsCategory = tab.Toolbox.categories[4];
    tab.Toolbox.addBlock('<block type="delay"><value name="TIME"><shadow type="math_number"><field name="NUM">1000</field></shadow></value></block>', tab.Toolbox.systemsCategory);
    tab.Toolbox.addBlock('<block type="time"></block>', tab.Toolbox.systemsCategory);
    // tab.Toolbox.addBlock('<block type="lists_create_with"><mutation items="0"></mutation></block>', tab.Toolbox.listsCategory);
    // tab.Toolbox.addBlock('<block type="lists_create_with"></block>', tab.Toolbox.listsCategory);
    // tab.Toolbox.addBlock('<block type="lists_repeat"><value name="NUM"><shadow type="math_number"><field name="NUM">5</field></shadow></value></block>', tab.Toolbox.listsCategory);
    // tab.Toolbox.addBlock('<block type="lists_length"></block>', tab.Toolbox.listsCategory);
    // tab.Toolbox.addBlock('<block type="lists_isEmpty"></block>', tab.Toolbox.listsCategory);
    // tab.Toolbox.addBlock('<block type="lists_indexOf"><value name="VALUE"><block type="variables_get"><field name="VAR">{listVariable}</field></block></value></block>', tab.Toolbox.listsCategory);
    // tab.Toolbox.addBlock('<block type="lists_getIndex"><value name="VALUE"><block type="variables_get"><field name="VAR">{listVariable}</field></block></value></block>', tab.Toolbox.listsCategory);
    // tab.Toolbox.addBlock('<block type="lists_setIndex"><value name="LIST"><block type="variables_get"><field name="VAR">{listVariable}</field></block></value></block>', tab.Toolbox.listsCategory);
    // tab.Toolbox.addBlock('<block type="lists_getSublist"><value name="LIST"><block type="variables_get"><field name="VAR">{listVariable}</field></block></value></block>', tab.Toolbox.listsCategory);
    // tab.Toolbox.addBlock('<block type="lists_split"><value name="DELIM"><shadow type="text"><field name="TEXT">,</field></shadow></value></block>', tab.Toolbox.listsCategory);
    // tab.Toolbox.addBlock('<block type="lists_sort"></block>', tab.Toolbox.listsCategory);

    // tab.Toolbox.disableBlock(["lists_create_with", "lists_create_with", "lists_repeat", "lists_length", "lists_isEmpty", "lists_indexOf", "lists_getIndex", "lists_setIndex", "lists_getSublist", "lists_split", "lists_sort"], tab.Toolbox.listsCategory);


    // tab.Toolbox.colourCategory = tab.Toolbox.categories[4];
    //
    // tab.Toolbox.addBlock('<block type="colour_picker"></block>', tab.Toolbox.colourCategory);
    // tab.Toolbox.addBlock('<block type="colour_random"></block>', tab.Toolbox.colourCategory);
    // tab.Toolbox.addBlock('<block type="colour_rgb"><value name="RED"><shadow type="math_number"><field name="NUM">100</field></shadow></value><value name="GREEN"><shadow type="math_number"><field name="NUM">50</field></shadow></value><value name="BLUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value></block>', tab.Toolbox.colourCategory);
    // tab.Toolbox.addBlock('<block type="colour_blend"><value name="COLOUR1"><shadow type="colour_picker"><field name="COLOUR">#ff0000</field></shadow></value><value name="COLOUR2"><shadow type="colour_picker"><field name="COLOUR">#3333ff</field></shadow></value><value name="RATIO"><shadow type="math_number"><field name="NUM">0.5</field></shadow></value></block>', tab.Toolbox.colourCategory);

    tab.Toolbox.variableCategory = tab.Toolbox.categories[5];

    tab.Toolbox.addBlock('<block type="variables_get"></block>', tab.Toolbox.variableCategory);
    tab.Toolbox.addBlock('<block type="variables_set"></block>', tab.Toolbox.variableCategory);
    tab.Toolbox.addBlock('<block type="variables_set"><value name="VALUE"><block type="variables_set_type"></block></value></block>', tab.Toolbox.variableCategory);
    tab.Toolbox.addBlock('<block type="variables_set_type"></block>', tab.Toolbox.variableCategory);

    tab.Toolbox.componentCategory = tab.Toolbox.categories[7];

}