from svggen.api.Driver import Driver
from svggen.api.ports.CodePort import InPort
from svggen.api.component import Component
from svggen.api.ports.ElectricalPort import PWMInputPort, PWMOutputPort, ElectricalPort
from svggen.api.CodeComponent import CodeComponent
from svggen.api.ports.CodePort import *
from svggen.api.ElectricalComponent import ElectricalComponent
from svggen.api.composables.VirtualElectricalComposable import VirtualElectricalComposable
from svggen.api.targets.ArduinoTarget import Arduino
from svggen.api.targets.PythonTarget import Python

from svggen.api.composables.ElectricalComposable import ElectricalComposable


class RGBLEDDriver(Driver):
    def __init__(self, yamlFile=None, **kwargs):
        Driver.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        Driver.define(self)

        self.physical = {
            "numPins": 4,
            "power": {
                "Vin": [],
                "Ground": [1]
            },
            "aliases": ["redpin", "cathode", "greenpin", "bluepin"],
        }

        self.meta = {
            Arduino: {
                "code": "void @@name@@(int red, int green, int blue)\n" +
                        "{\n" +
                        "    analogWrite(<<rPin_@@name@@>>, red);\n" +
                        "    analogWrite(<<gPin_@@name@@>>, green);\n" +
                        "    analogWrite(<<bPin_@@name@@>>, blue);\n" +
                        "}\n",

                "inputs": {
                    "red_@@name@@": None,
                    "green_@@name@@": None,
                    "blue_@@name@@": None
                },

                "outputs": {
                    "driven": "@@name@@(<<red_@@name@@>>, <<green_@@name@@>>, <<blue_@@name@@>>)"
                },

                "declarations": "void @@name@@(int red, int green, int blue);",

                "setup": "    pinMode(<<rPin_@@name@@>>, OUTPUT);\n" + \
                         "    pinMode(<<gPin_@@name@@>>, OUTPUT);\n" + \
                         "    pinMode(<<bPin_@@name@@>>, OUTPUT);",

                "needs": set()
            },

            Python: {
                "code": "def @@name@@(red, green, blue):\n" +
                        "    r@@name@@.write(red)\n" +
                        "    g@@name@@.write(green)\n" +
                        "    b@@name@@.write(blue)\n" +
                        "\n",

                "inputs": {
                    "red_@@name@@": None,
                    "green_@@name@@": None,
                    "blue_@@name@@": None
                },

                "outputs": {
                    "driven": "@@name@@(<<red_@@name@@>>, <<green_@@name@@>>, <<blue_@@name@@>>)"
                },

                "setup": "r@@name@@ = mraa.Pwm(<<rPin_@@name@@>>)\n" + \
                         "g@@name@@ = mraa.Pwm(<<gPin_@@name@@>>)\n" + \
                         "b@@name@@ = mraa.Pwm(<<bPin_@@name@@>>)\n" + \
                         "\n" + \
                         "r@@name@@.enable(True)\n" + \
                         "g@@name@@.enable(True)\n" + \
                         "b@@name@@.enable(True)\n"
                ,

                "needs": set(["mraa"])
            }
        }

        self.addInterface("inRed", InIntPort(self, "inRed", "red_@@name@@"))
        self.addInterface("inGreen", InIntPort(self, "inGreen", "green_@@name@@"))
        self.addInterface("inBlue", InIntPort(self, "inBlue", "blue_@@name@@"))

        self.addInterface("rOut", ElectricalPort(self, [0], virtual=True))
        self.addInterface("gOut", ElectricalPort(self, [2], virtual=True))
        self.addInterface("bOut", ElectricalPort(self, [3], virtual=True))

        self.addInterface("rPWM", PWMInputPort(self, [0], virtual=True))
        self.addInterface("gPWM", PWMInputPort(self, [2], virtual=True))
        self.addInterface("bPWM", PWMInputPort(self, [3], virtual=True))

        self.addParameter("rPin", "", isSymbol=False)
        self.addParameter("gPin", "", isSymbol=False)
        self.addParameter("bPin", "", isSymbol=False)

        self.pmap = ["rPin", None, "gPin", "bPin"]











