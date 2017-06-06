var numTabs = 0;

class Tab {
    constructor(type, name, div, button) {

        // type is the kind of interface out of: start page, mechanical, base, and composite
        this.type = type;
        // name is the name of the tab.
        this.name = name;

        if(div === undefined){
            // create new interface in a div
            this.div = document.createElement("div");
            // populate interface with relevant content
            // this.div.innerHTML = type;
            this.id = type + numTabs;
            this.div.setAttribute("id", this.id);
            this.div.classList.add("tabcontent");
            this.div.style.width="100%";
            this.div.style.height="100%";
            this.div.classList.add("interface");
        } else {
            this.div = div;
        }

        if (button === undefined){
            // name the interface
            this.button = document.createElement("button");
            this.button.innerHTML = name;
            this.button.classList.add("tablinks");

            // attach button to div
            var id = this.id;
            this.button.addEventListener("click", function (evt) {
                openInterface(evt, id);
            });

            // code to convert button to text field on double click?
            // this.button.addEventListener("dblclick", function (evt) {
            //     this.
            // })
        } else {
            this.button = button;
        }
    }
}

startTabDiv = document.getElementById("start");
startTab = document.getElementById("defaultOpen");

var tabs = [new Tab("Starting Page", "start", startTabDiv, startTab)];

lastTab = document.getElementById("dropbtn");

function addTab(t) {
    // create new button for interface in the tabs list
    t.div.style.display="none";
    document.getElementById("tabButtons").insertBefore(t.button, lastTab);
    document.getElementById("tabs").insertBefore(t.div, null);
    populateTab(t); // put your interface in the div of this tab.

}

function populateTab(t) {
    switch (t.type) {
        case "base":
            populateBase(t);
            break;
        case "composite":
            populateComp(t);
            break;
        case "mechanical":
            populateMech(t);
            break;
        default:
            console.log("Something bad happenned. Invalid type name for tab. ");

    }
}

function showOptions() {
    document.getElementById("rocoInterfaces").classList.toggle("show");
}

window.onclick = function(e) {
  if (!e.target.matches('.dropbtn')) {
    var rocoInterfaces = document.getElementById("rocoInterfaces");
      if (rocoInterfaces.classList.contains('show')) {
        rocoInterfaces.classList.remove('show');
      }
  }
}

function newInterface(event, type) {
    var t = "";
    if(type == 'm'){
        t = "mechanical";
    } else if (type == 'cc') {
        t = "composite";
    } else if (type == 'bc') {
        t = "base";
    }
    var name = "untitled" + (numTabs==0?"":numTabs);
    numTabs++;
    tabs.push(new Tab(t, name));
    addTab(tabs[tabs.length - 1]);
}
