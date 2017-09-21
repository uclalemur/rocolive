var ports = Toolbox.addCategory('<category name="Ports" colour="105"></category>', toolboxXML);
Toolbox.inputCategory = Toolbox.addCategory('<category name="input" colour="105"></category>', ports);
Toolbox.outputCategory = Toolbox.addCategory('<category name="output" colour="105"></category>', ports);
Toolbox.addBlock('<block type="InPort|input"></block>', Toolbox.inputCategory);
Toolbox.addBlock('<block type="InStringPort|input"></block>', Toolbox.inputCategory);
Toolbox.addBlock('<block type="InIntPort|input"></block>', Toolbox.inputCategory);
Toolbox.addBlock('<block type="InFloatPort|input"></block>', Toolbox.inputCategory);
Toolbox.addBlock('<block type="InDoublePort|input"></block>', Toolbox.inputCategory);


Toolbox.addBlock('<block type="OutPort|output"></block>', Toolbox.outputCategory);
Toolbox.addBlock('<block type="OutStringPort|output"></block>', Toolbox.outputCategory);
Toolbox.addBlock('<block type="OutIntPort|output"></block>', Toolbox.outputCategory);
Toolbox.addBlock('<block type="OutFloatPort|output"></block>', Toolbox.outputCategory);
Toolbox.addBlock('<block type="OutDoublePort|output"></block>', Toolbox.outputCategory);

