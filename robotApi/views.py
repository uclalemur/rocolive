from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from roco.library import all_components, get_component, build_database, filter_components, filter_database
from roco.api import component
from roco.api.utils.variable import Variable
from roco.derived.ports import edge_port
from roco.utils.utils import scheme_list
import sympy
import copy_reg
import types
import ast
import traceback
import copy
import json
import pdb
from sympy import evalf

def reduce_method(m):
    return (getattr, (m.__self__, m.__func__.__name__))

copy_reg.pickle(types.MethodType, reduce_method)

# Create your views here.

@api_view(['GET','POST'])
def componentList(request):
    '''
    Returns a list of the avaliable components with their interfaces
    '''
    if request.method == 'GET' or request.method == 'POST':
        data = ast.literal_eval(request.body)
        try:
            filter = [data['key']]
        except:
            filter = ["actuator","mechanical"]
        #l = []
        #for c in filterComponents(filter):
         #   l.append(c)
        #response = json.dumps({"response": l})
        #print response
        components = filter_database()
        response = []
        for c in components:
            response.append([c.name, [x.encode('ascii','ignore') for x in c.interfaces.keys()]])
        response = {"response": response}.__str__().replace("'", '"')
        #print response
        #response = '{"response": [["TestCompC", ["e1", "e2", "e3", "e4"]], ["Cube", ["edge"]], ["Trapezoid", ["t", "b"]], ["Trapezoid2", ["t", "b", "s1", "s2"]], ["Rectangle", ["r", "b", "l", "t"]], ["Triangle", ["a", "b", "c"]], ["BeamHinge", ["t_A", "b_A", "r_A", "l_A", "t_B", "b_B", "r_B", "l_B"]], ["RectBeam", ["botedge3", "topedge2", "botedge0", "botedge1", "topedge0", "topedge1", "botedge2", "topedge3"]]]}'
        return HttpResponse(response, content_type="application/json")
    return HttpResponse(status=501)

@api_view(['GET', 'POST'])
def fixEdgeInterface(request):
    #f request.method == 'GET' or request.method == 'POST':
    #    data = ast.literal_eval(request.body)
    #    fc = request.session['component']
    #    compName = data['name']
    #    interface = data['interface']
    #    value = int(data['value'])
    #    fc.fixEdgeInterface(compName, interface, value)
    #    request.session.modified = True
    #    return HttpResponse('Edge associated with interface {}.{} fixed to {}'.format(compName, interface, value))
    return HttpResponse(status=501)

@api_view(['GET', 'POST'])
def constrainParameter(request):
    if request.method == 'GET' or request.method == 'POST':
        data = ast.literal_eval(request.body)
        fc = request.session['component'][data['id']]
#        pdb.set_trace()
        sc = data['sc']
        parameter = data['parameter']
        constraint = data['constraint']
        fc.constrain_subcomponent_parameter((sc, parameter), fc._str_to_sympy(constraint))
        request.session.modified = True
        return HttpResponse(sc + "_" + "parameter" + " constrained to " + constraint)
    return HttpResponse(status=501)

@api_view(['GET', 'POST'])
def createComponent(request):
    """
    Create a new Component
    """
    if request.method == 'GET' or request.method == 'POST':
        print 'createComponent request', request
        #pdb.set_trace()
        sessionComponent = component.Component() #Create component
        name = id(sessionComponent)
        data = ast.literal_eval(request.body)
        try:
            if not isinstance(request.session['component'], dict):
                raise Exception()
        except:
            request.session['component'] = {}
        try:
            del request.session['component'][data['id']]
        except Exception as e:
            pass
        #Store session component
        request.session['component'][data['id']] = sessionComponent
        request.session.modified = True
        return HttpResponse('FoldedComponent {} Created'.format(name))


    return HttpResponse(status=501)

@api_view(['GET', 'POST'])
def addSubcomponent(request):
    """
    Add subcomponent to component
    """
    if request.method == 'GET' or request.method == 'POST':
        try:
            #pdb.set_trace()
            #Get arguments from HTTP request
            data = ast.literal_eval(request.body)
            scname = data['name']
            type = data['type']

            #Add the subcomponent to the session component
            sessionComponent = request.session['component'][data['id']]
            sessionComponent.add_subcomponent(scname,type)
            #sc = {"class": type, "parameters": {}, "constants": None, "baseclass": "FoldedComponent", "component": None}
            #sessionComponent.subcomponents.set_default(scname, sc)
            #sessionComponent.resolve_subcomponent(scname)
            ########
#            pdb.set_trace()
            #Return information about subcomponent
            c = get_component(type)#, baseclass="FoldedComponent")
            c.make_output(remake=False, placeOnly=True)
            print c.parameters
            #print "Before extract"
            responseDict = extractFromComponent(c)
            #print "After extract"
            #print responseDict
            response = compDictToJSON(responseDict, c)
            #print "Jsonified"
            request.session.modified = True
            try:
                return HttpResponse(response, content_type="application/json")
            except Exception as e:
                traceback.print_exc()
        except Exception as e:
            traceback.print_exc()
            return HttpResponse(status=501)
    return HttpResponse(status=501)

@api_view(['GET', 'POST'])
def delSubcomponent(request):
    """
    Add subcomponent to component
    """
    if request.method == 'GET' or request.method == 'POST':
        try:
            #pdb.set_trace()
            #Get arguments from HTTP request
            data = ast.literal_eval(request.body)
            scname = data['name']

            sessionComponent = request.session['component'][data['id']]
            sessionComponent.del_subcomponent(scname)
            request.session.modified = True
            print "Subcomponent {} deleted".format(scname)
            return HttpResponse("Subcomponent {} deleted".format(scname))
        except Exception as e:
            traceback.print_exc()
            return HttpResponse(status=501)
    return HttpResponse(status=501)

@api_view(['GET','POST'])
def addConnection(request):
    if request.method == 'GET' or request.method == 'POST':
        try:
            data = ast.literal_eval(request.body)
            fc = request.session['component'][data['id']]
            sc1 = data['sc1']
            port1 = data['port1']
            sc2 = data['sc2']
            port2 = data['port2']
            angle = int(data['angle'])
            fc.add_connection((sc1,port1),(sc2,port2), angle=angle)
            request.session.modified = True
            print 'Connection from {}:{} to {}:{} Added to Component {}'.format(sc1,port1,sc2,port2,"")
            return HttpResponse('Connection from {}:{} to {}:{} Added to Component {}'.format(sc1,port1,sc2,port2,""))
        except KeyError:
            return HttpResponse(status=501)
    return HttpResponse(status=501)

@api_view(['GET','POST'])
def addTabConnection(request):
    if request.method == 'GET' or request.method == 'POST':
        try:
            data = ast.literal_eval(request.body)
            fc = request.session['component'][data['id']]
            sc1 = data['sc1']
            port1 = data['port1']
            sc2 = data['sc2']
            port2 = data['port2']
            angle = int(data['angle'])
            fc.add_connection((sc1,port1),(sc2,port2), tab=True, angle=angle)
            request.session.modified = True
            print 'Connection from {}:{} to {}:{} Added to Component {}'.format(sc1,port1,sc2,port2,"")
            return HttpResponse('Connection from {}:{} to {}:{} Added to Component {}'.format(sc1,port1,sc2,port2,""))
        except KeyError:
            return HttpResponse(status=501)
    return HttpResponse(status=501)

@api_view(['GET','POST'])
def addParameter(request):
    if request.method == 'GET' or request.method == 'POST':
        try:
            data = ast.literal_eval(request.body)
            fc = request.session['component'][data['id']]
            name = data['name']
            default = data['def']
            try:
                value = ast.literal_eval(default)
            except:
                value = default
            fc.add_parameter(name, value)
            request.session.modified = True
            print 'Parameter ' + name + ' added with default value ' + default
            return HttpResponse('Parameter ' + name + ' added with default value ' + default)
        except KeyError:
            return HttpResponse(status=501)
    return HttpResponse(status=501)

@api_view(['GET','POST'])
def delParameter(request):
    if request.method == 'GET' or request.method == 'POST':
        try:
            data = ast.literal_eval(request.body)
            fc = request.session['component'][data['id']]
            name = data['name']
            fc.del_parameter(name)
            request.session.modified = True
            print 'Parameter ' + name + ' deleted'
            return HttpResponse('Parameter ' + name + ' deleted')
        except KeyError:
            return HttpResponse(status=501)
    return HttpResponse(status=501)

@api_view(['GET','POST'])
def delInterface(request):
    if request.method == 'GET' or request.method == 'POST':
        try:
            data = ast.literal_eval(request.body)
            fc = request.session['component'][data['id']]
            name = data['name']
            fc.del_interface(name)
            request.session.modified = True
            print 'Interface ' + name + ' deleted'
            return HttpResponse('Interface ' + name + ' deleted')
        except KeyError:
            return HttpResponse(status=501)
    return HttpResponse(status=501)

@api_view(['GET','POST'])
def make(request):
    """
    Create a new Component
    """
    if request.method == 'GET' or request.method == 'POST':
        try:
            data = ast.literal_eval(request.body)
            fc = request.session['component'][data['id']]
#            pdb.set_trace()
            fc.make_output(placeOnly=True)
            #print fc.__dict__
            #print "made"
            print "Before component extraction"
            responseDict = extractFromComponent(fc)
            #print responseDict
            responseDict['parameters'] = {}
            for key in fc.parameters.keys():
                responseDict['parameters'][key] = fc.parameters[key].__str__()
            #print responseDict
            responseDict['variables'] = []
            response = {"response": responseDict}.__str__().replace("'", '"').replace('(', '[').replace(')', ']').replace('False', '0').replace('True', '1')
            #print response
            request.session.modified = True
            return HttpResponse(response, content_type="application/json")
        except Exception as e:
            print '%s (%s)' % (e.message, type(e))
            traceback.print_exc()
            return HttpResponse(status=501)
    return HttpResponse(status=501)

@api_view(['GET','POST'])
def getSVG(request):
    """
    Create a new Component
    """
    #pdb.set_trace()
    if request.method == 'GET' or request.method == 'POST':
        try:
            data = ast.literal_eval(request.body)
            fc = request.session['component'][data['id']]
            #pdb.set_trace()
            #####
            svg = fc.composables['graph'].make_output(filedir=".",svgString = True)
            try:
                if not isinstance(request.session['svg'], dict):
                    raise Exception()
            except:
                request.session['svg'] = {}
            request.session['svg'][data['id']] = svg[0]

            svg = svg[1].__str__().replace('"',"'")
            response = '{"response": "' + svg +'"}'
            #print response
            request.session.modified = True
            return HttpResponse(response, content_type="application/json")
        except Exception as e:
            print '%s (%s)' % (e.message, type(e))
            traceback.print_exc()
            return HttpResponse(status=611)
    return HttpResponse(status=611)

@api_view(['GET','POST'])
def downloadSVG(request):
    """
    Create a new Component
    """
    #pdb.set_trace()
    if request.method == 'GET' or request.method == 'POST':
        try:
            dxf = open('silhouette.dxf', 'r')
            #svg = request.session['svg']
            dxf = dxf.read().replace('"',"'").replace('\n', '\\n')
            response = '{"response": "' + dxf +'"}'
            return HttpResponse(response, content_type="application/json")
        except Exception as e:
            print '%s (%s)' % (e.message, type(e))
            traceback.print_exc()
            return HttpResponse(status=611)
    return HttpResponse(status=611)

@api_view(['GET','POST'])
def downloadYaml(request):
    if request.method == 'GET' or request.method == 'POST':
        try:
            data = ast.literal_eval(request.body)
            yaml = request.session['component'][data['id']].to_yaml()
            yaml = yaml.replace('"',"'")
            yaml = yaml.replace('\n', '\\n')
            response = '{"response": "' + yaml +'"}'
            return HttpResponse(response, content_type="application/json")
        except Exception as e:
            print '%s (%s)' % (e.message, type(e))
            traceback.print_exc()
            return HttpResponse(status=611)
    return HttpResponse(status=611)

@api_view(['GET','POST'])
def componentSave(request):
    if request.method == 'GET' or request.method == 'POST':
        try:
            data = ast.literal_eval(request.body)
            fc = request.session['component'][data['id']]
            name = data['name']
            fc.to_yaml("library/" + name + ".yaml")
            build_database([get_component(name)])
            print "{} saved to library".format(name)
            return HttpResponse("{} saved to library".format(name))
        except Exception as e:
            print '%s (%s)' % (e.message, type(e))
            traceback.print_exc()
            return HttpResponse(status=611)
    return HttpResponse(status=611)

@api_view(['GET','POST'])
def inheritInterface(request):
    if request.method == 'GET' or request.method == 'POST':
        try:
            data = ast.literal_eval(request.body)
            fc = request.session['component'][data['id']]
            name = data['name']
            scname = data['scname']
            interface = data['interface']
            fc.inherit_interface(name, (scname, interface))
            request.session.modified = True
            print "Interface {} from {} inherited as {}".format(interface, scname, name)
            return HttpResponse("Interface {} from {} inherited as {}".format(interface, scname, name))
        except Exception as e:
            print '%s (%s)' % (e.message, type(e))
            traceback.print_exc()
            return HttpResponse(status=611)
    return HttpResponse(status=611)

def getLen(object):
    try:
        return len(object)
    except:
        return 0

def getList(object):
    try:
        return object.toList()
    except:
        return []

def extractFromComponent(c):
    output = {}
    output["solved"] = {str(x) : x.get_value() for x in c.parameters.values() if isinstance(x, Variable)}
    print output["solved"]
    output["faces"] = {}
    for i in c.composables['graph'].faces:
        tdict = copy.deepcopy(i.get_triangle_dict())
        for vertex in range(len(tdict["vertices"])):
            try:
                tpl = tdict["vertices"][vertex]
                tdict["vertices"][vertex] = [tpl[0], tpl[1]]
                if isinstance(tdict["vertices"][vertex][0], sympy.Basic):
                    tdict["vertices"][vertex][0] = scheme_list(tdict["vertices"][vertex][0])
                if isinstance(tdict["vertices"][vertex][1], sympy.Basic):
                    tdict["vertices"][vertex][1] = scheme_list(tdict["vertices"][vertex][1])
            except:
                try:
                    tdict["vertices"][vertex][1] = scheme_list(tdict["vertices"][vertex][1])
                except:

                    pass
        output["faces"][i.name] = [[scheme_list(i.transform_3D[x]) for x in range(getLen(i.transform_3D))], tdict]
        #print i.transform2D.tolist()
        trans2D = [[scheme_list(p) for p in j] for j in getList(i.transform_2D)]
        #print trans2D
        output["faces"][i.name].append(trans2D)
    output["edges"] = {}
    for i in c.composables['graph'].edges:
        output["edges"][i.name] = []
        for v in range(2):
            output["edges"][i.name].append([])
            for x in range(3):
                try:
                    if isinstance(i.pts_3D[v][x], sympy.Basic):
                        output["edges"][i.name][v].append(scheme_list(i.pts_3D[v][x]))
                except:
                    pass
    output["interfaceEdges"] = {}
    print c.interfaces
    for k,v in c.interfaces.iteritems():
        ports = c.get_interface(k).get_ports()
        for port in ports:
            if isinstance(port,edge_port.EdgePort):
                output["interfaceEdges"][k] = []
                for i in port.get_edges():
                    try:
                        output["interfaceEdges"][k].append(i)
                    except:
                        pass

    return output

def compDictToJSON(responseDict, component):
    responseDict['parameters'] = {}
    for key in component.parameters.keys():
        responseDict['parameters'][key] = component.parameters[key].__str__()

    responseDict['variables'] = []

    return {"response": responseDict}.__str__().replace("'", '"').replace('(', '[').replace(')', ']').replace(
        'False', '0').replace('True', '1')
