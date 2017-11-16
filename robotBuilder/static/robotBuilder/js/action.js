var getActiveTab = function(){};
function openInterface(evt, interfaceName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    console.log(interfaceName);

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(interfaceName).style.display = "block";
    if(evt)
        evt.currentTarget.className += " active";
    if (getActiveTab()) {
        t = getActiveTab();
        if (t.type == "bc" || t.type == "cc")
            document.getElementById("export").style.display="block";
        else
            document.getElementById("export").style.display="none";
    }
}

document.getElementById("defaultOpen").click();
window.onresize = function() {
    $('.tabcontent').each(function(i, obj) {
	obj.style.height = window.innerHeight - $("#tabButtons").outerHeight();
    });
};
