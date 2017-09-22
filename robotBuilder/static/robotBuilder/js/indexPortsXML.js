function addPorts(tab) {
	var ports = tab.Toolbox.addCategory('<category name="Ports" colour="105"></category>', tab.toolboxXML);
	tab.Toolbox.inputCategory = tab.Toolbox.addCategory('<category name="input" colour="105"></category>', ports);
	tab.Toolbox.outputCategory = tab.Toolbox.addCategory('<category name="output" colour="105"></category>', ports);
	tab.Toolbox.addBlock('<block type="InPort|input"></block>', tab.Toolbox.inputCategory);
	tab.Toolbox.addBlock('<block type="InStringPort|input"></block>', tab.Toolbox.inputCategory);
	tab.Toolbox.addBlock('<block type="InIntPort|input"></block>', tab.Toolbox.inputCategory);
	tab.Toolbox.addBlock('<block type="InFloatPort|input"></block>', tab.Toolbox.inputCategory);
	tab.Toolbox.addBlock('<block type="InDoublePort|input"></block>', tab.Toolbox.inputCategory);


	tab.Toolbox.addBlock('<block type="OutPort|output"></block>', tab.Toolbox.outputCategory);
	tab.Toolbox.addBlock('<block type="OutStringPort|output"></block>', tab.Toolbox.outputCategory);
	tab.Toolbox.addBlock('<block type="OutIntPort|output"></block>', tab.Toolbox.outputCategory);
	tab.Toolbox.addBlock('<block type="OutFloatPort|output"></block>', tab.Toolbox.outputCategory);
	tab.Toolbox.addBlock('<block type="OutDoublePort|output"></block>', tab.Toolbox.outputCategory);

}