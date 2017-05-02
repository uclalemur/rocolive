from svggen.api.Driver import Driver
from svggen.api.ports.CodePort import InPort
from svggen.api.component import Component
from svggen.api.CodeComponent import CodeComponent
from svggen.api.ports.CodePort import *
from svggen.api.targets.ArduinoTarget import Arduino
from svggen.api.targets.PythonTarget import Python

class UISlider(CodeComponent):

    def __init__(self, yamlFile=None, **kwargs):
        CodeComponent.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        self.addParameter("min", 0, isSymbol=False)
        self.addParameter("max", 1023, isSymbol=False)

        self.meta = {
            Arduino: {
                "code": "",

                "inputs": {
                },

                "outputs": {
                    "slider_@@name@@": "slider_@@name@@"
                },

                "declarations": "int slider_@@name@@ = 0;\n",

                "needs": {"Arduino.h", "WiFiClient.h", "ESP8266WiFi.h", "ESP8266WebServer.h", "ESP8266mDNS.h", "WebSocketsServer.h"},

                "setup": "",

                "interface": {
                    "html": "<input id=\\\"@@name@@\\\" type=\\\"range\\\" min=\\\"<<min_@@name@@>>\\\" max=\\\"<<max_@@name@@>>\\\" oninput=\\\"@@name@@_slider(this.value)\\\">",
                    "style": "",
                    "js": "var @@name@@_slider = function(sliderValue){\n" +
                          "    connection.send(\\\"@@name@@\\\" + sliderValue.toString());\n" +
                          "};\n",
                    "event": "if(NULL != strstr((char *) payload, \"@@name@@\")){\n"
                             "    slider_@@name@@ = atoi((char *)(payload + strlen(\"@@name@@\")));\n"
                             "}\n"
                }
            }
        }
        self.addInterface("outInt", OutIntPort(self, "outInt", "slider_@@name@@"))
        CodeComponent.define(self, **kwargs)

    def assemble(self):
        CodeComponent.assemble(self)



