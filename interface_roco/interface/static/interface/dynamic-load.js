var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        myfunction(xmlhttp);
    }
};

xmlhttp.open("GET", "resources/map.txt", true);
xmlhttp.send();

function myfunction(xml) {
    var txt = xml.responseText;
    console.log(txt);
}
