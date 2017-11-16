var numTabs = 0;
var tabNames = ['Start'];

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
            this.button.tab = this;

            // attach button to div
            var id = this.id;
            tabButton.addEventListener("click", function (evt) {
                openInterface(evt, id);
                // activeTab = this.tab;
            });
            var closeButton = document.createElement("button");
            closeButton.innerHTML = "X";
            closeButton.classList.add("tablinks");
            closeButton.addEventListener("click", function (evt) {
                console.log("closing",id);
            });
            // name the interface
            this.button = document.createElement("div");
            this.button.appendChild(tabButton);
            this.button.appendChild(closeButton);

            // code to convert button to text field on double click?
            // this.button.addEventListener("dblclick", function (evt) {
            //     this.
            // })
        } else {
            this.button = button;
        }
    }
}

document.getElementById("export").style.display="none";
startTabDiv = document.getElementById("start");
startTab = document.getElementById("defaultOpen");
var tabs = [new Tab("Starting Page", "start", startTabDiv, startTab)];
// activeTab = tabs[0];

lastTab = document.getElementById("dropbtn");

function addTab(t) {
    // create new button for interface in the tabs list
    t.div.style.display="none";
    document.getElementById("tabButtons").insertBefore(t.button, lastTab);
    document.getElementById("tabs").insertBefore(t.div, null);
    openInterface(null, t.id);
    t.button.className += " active";
    populateTab(t);
    if (t.type == "base" || t.type == "composite")
        document.getElementById("export").style.display="block";
    else
        document.getElementById("export").style.display="none";
    t.div.style.height = window.innerHeight - $("#tabButtons").outerHeight();
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
            console.log("Something bad happened. Invalid type name for tab. ");

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

function getActiveTabNum() {
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        if (tabcontent[i].style.display == "block") {
            return i;
        }

    }
}

function getActiveTab() {
    return tabs[getActiveTabNum()];
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
    var name = "";
    while (true) {
        if(name === null){
          return;
        }else if(name == ""){
          name = window.prompt("Name the component", "");
          continue;
        }else if(tabNames.includes(name)){
          name = window.prompt("A tab with that name already exists.\nPlease choose another name", "");
          continue;
        }else{
          tabNames.push(name);
          break;
        }
    }
    numTabs++;
    tabs.push(new Tab(t, name));
    addTab(tabs[tabs.length - 1]);
    tabs[tabs.length-1].type = type;
    // activeTab = tabs[tabs.length - 1];
}
