lastTabDiv = document.getElementById("start");
lastTab = document.getElementById("defaultOpen");

class Tab {
    constructor(type, name, div, button) {

        // type is the kind of interface out of: start page, mechanical, code, and composite
        this.type = type;
        // name is the name of the tab.
        this.name = name;

        if(div === undefined){
            // create new interface in a div
            this.div = document.createElement("div");
            // populate interface with relevant content
            this.div.innerHTML = type;
            this.div.setAttribute("id", type);
            this.div.classList.add("tabcontent");
        } else {
            this.div = div;
        }

        if (button === undefined){
            // name the interface
            this.button = document.createElement("button");
            this.button.innerHTML = name;
            this.button.classList.add("tablinks");

            // attach button to div
            this.button.addEventListener("click", function (evt) {
                openInterface(evt, type);
            });
        } else {
            this.button = button;
        }
    }
}

function addTab(t) {
    // create new button for interface in the tabs list
    t.div.style.display="none";
    document.getElementById("tabButtons").insertBefore(t.button, null);
    document.getElementById("tabs").insertBefore(t.div, null);
}
