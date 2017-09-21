function populateMech(t) {
    // input: tab object.
    // TODO: fill out this function so that the div t.div contains the mechanical interface.
    $("#"+t.div.id).load("/mech", function() {
        t.mechanicalInterface = new MechanicalInterface(t.name, t.div, t.div.getElementsByClassName("componentView")[0], t.div.getElementsByClassName("drawingView")[0]);
        t.mechanicalInterface.mechanicalGo();
    });
    //$("#"+t.div.id).load("/mech", function() { mechanical_go(); });
}
