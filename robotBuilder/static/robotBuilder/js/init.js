function getToolbox(t, tab){
	t.toolbox = '<xml><category colour="180" name="code"><block type="string_to_motor'+tab+'|0" /><block type="serial_to_string'+tab+'|0" /><block type="reverse_string'+tab+'|0" /><block type="sort_string'+tab+'|0" /><block type="string_source'+tab+'|0" /><block type="serial_in'+tab+'|0" /></category><category colour="180" name="electrical"><block type="pot'+tab+'|0" /><block type="node_mcu'+tab+'|0" /></category><category colour="180" name="code, electrical"><block type="pot_driver'+tab+'|0" /><block type="driver'+tab+'|0" /></category></xml>';
}
