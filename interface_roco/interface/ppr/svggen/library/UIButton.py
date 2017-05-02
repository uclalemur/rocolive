from svggen.api.Driver import Driver
from svggen.api.ports.CodePort import InPort
from svggen.api.component import Component
from svggen.api.CodeComponent import CodeComponent
from svggen.api.ports.CodePort import *
from svggen.api.targets.ArduinoTarget import Arduino
from svggen.api.targets.PythonTarget import Python

class UIButton(CodeComponent):

    def __init__(self, yamlFile=None, **kwargs):
        CodeComponent.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        self.addParameter("text", "Button", isSymbol=False)

        self.meta = {
            Arduino: {
                "code": "",

                "inputs": {
                },

                "outputs": {
                    "button_@@name@@": "button_@@name@@"
                },

                "declarations": "int button_@@name@@ = 0;\n",

                "needs": {"Arduino.h", "WiFiClient.h", "ESP8266WiFi.h", "ESP8266WebServer.h", "ESP8266mDNS.h", "WebSocketsServer.h"},

                "setup": "",

                "interface": {
                    "html": "<button id=\\\"button_@@name@@\\\" class=\\\"button\\\"><<text_@@name@@>></button>",
                    "style": "",
                    "js": "document.getElementById(\\\"button_@@name@@\\\").ontouchstart = function() {\n" +
                          "    connection.send(\\\"@@name@@down\\\");\n" +
                          "};\n" +
                          "document.getElementById(\\\"button_@@name@@\\\").ontouchend = function() {\n" +
                          "    connection.send(\\\"@@name@@up\\\");\n" +
                          "};\n",
                    "event": "if(!strcmp(\"@@name@@down\", (char *) payload)){\n" +
                             "   button_@@name@@ = 1;\n" +
                             "}\n" +
                             "if(!strcmp(\"@@name@@up\", (char *) payload)){\n" +
                             "   button_@@name@@ = 0;\n" +
                             "}\n"
                }
            }
        }

        self.addInterface("outInt", OutIntPort(self, "outInt", "button_@@name@@"))
        CodeComponent.define(self, **kwargs)


    def assemble(self):
        CodeComponent.assemble(self)




