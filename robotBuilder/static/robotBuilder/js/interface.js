var listURL     = "/api/component/list/"
var createURL   = "/api/component/create/"
var addScURL    = "/api/component/addSubcomponent/"
var addCnURL    = "/api/component/addConnection/"
var addTabURL    = "/api/component/addTab/"
var makeURL     = "/api/component/make/"
var svgURL      = "/api/component/svg/"
var svgDlURL    = "/api/component/download/svg/"
var fEdgeURL    = "/api/component/fixEdgeInterface/"
var cParameterURL = "/api/component/constrainParameter/"
var yamlDlURL   = "/api/component/download/yaml/"
var addParameterURL = "/api/component/addParameter/"
var delSubcomponentURL = "/api/component/delSubcomponent/"
var delParameterURL = "/api/component/delParameter/"
var delInterfaceURL = "/api/component/delInterface/"
var inheritInterfaceURL = "/api/component/inheritInterface/"
var componentSaveURL = "/api/component/save/"

function getComponentList(key, callback)
{
    httpPostAsync(listURL,"{'key': '" + key + "'}",callback);
}

function createComponent(id)
{
    httpPostAsync(createURL,"{'id': '" + id + "'}",function(){});
}

function addSubcomponent(id, name, type, callback)
{
    httpPostAsync(addScURL,"{'name': '" + name + "','id': '" + id + "','type': '" + type + "'}",callback);
}

function fixComponentEdgeInterface(id, name, interface, value)
{
    httpPostAsync(fEdgeURL, "{'name': '" + name + "', 'id': '" + id + "','interface': '" + interface + "', 'value': '" + value + "'}", function(){});
}

function addComponentConnection(id, sc1, port1, sc2, port2, args, flip, callback)
{
    httpPostAsync(addCnURL,"{'sc1': '" + sc1 + "','id': '" + id + "','sc2': '" + sc2 + "','port1': '" + port1 + "','port2': '" + port2 + "','angle': '" + args + "', 'flip': '" + flip + "'}",callback);
}

function addTabConnection(id, sc1, port1, sc2, port2, args, callback)
{
    httpPostAsync(addTabURL,"{'sc1': '" + sc1 + "','id': '" + id + "','sc2': '" + sc2 + "','port1': '" + port1 + "','port2': '" + port2 + "','angle': '" + args + "'}",callback);
}

function constrainParameter(id, sc, parameter, constr)
{
    httpPostAsync(cParameterURL, "{'sc': '" + sc + "', 'id': '" + id + "','parameter': '" + parameter + "', 'constraint': '" + constr + "'}", function(){});
}

function makeComponent(id, callback)
{
    httpPostAsync(makeURL,"{'id': '" + id + "'}",callback);
}

function getSVG(id, callback)
{
    httpPostAsync(svgURL,"{'id': '" + id + "'}",callback);
}

function getSVGDownload(id, callback)
{
    httpPostAsync(svgDlURL,"{'id':'" + id + "'}",callback);
}

function getYamlDownload(id, callback)
{
    httpPostAsync(yamlDlURL,"{'id': '" + id + "'}", callback);
}

function addParameter(id, name, def)
{
    httpPostAsync(addParameterURL, "{'name': '" + name + "', 'id': '" + id + "','def': '" + def + "'}", function(){});
}

function delSubcomponent(id, name)
{
    httpPostAsync(delSubcomponentURL, "{'id': '" + id + "','name': '" + name + "'}", function(){});
}

function delParameter(id, name)
{
    httpPostAsync(delParameterURL, "{'id': '" + id + "','name': '" + name + "'}", function(){});
}

function delInterface(id, name)
{
    httpPostAsync(delInterfaceURL, "{'id': '" + id + "','name': '" + name + "'}", function(){});
}

function inheritInterface(id, name, scname, interface)
{
    httpPostAsync(inheritInterfaceURL, "{'id': '" + id + "','name': '" + name + "', 'scname': '" + scname + "', 'interface': '" + interface + "'}", function(){});
}

function componentSave(id, name, callback)
{
    httpPostAsync(componentSaveURL, "{'id': '" + id + "','name': '" + name + "'}", callback)
}

function httpPostAsync(theUrl, data, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("POST", theUrl, true); // true for asynchronous
    xmlHttp.send(data);
}
