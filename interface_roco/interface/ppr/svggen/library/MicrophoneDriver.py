from svggen.api.Driver import Driver
from svggen.api.targets.ArduinoTarget import Arduino
from svggen.api.targets.PythonTarget import Python
from svggen.api.composables.ElectricalComposable import ElectricalComposable
from svggen.api.ports.ElectricalPort import ElectricalPort, AnalogOutputPort
from svggen.api.ports.CodePort import OutIntPort

class MicrophoneDriver(Driver):

    def __init__(self, yamlFile=None, **kwargs):
        Driver.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        Driver.define(self, **kwargs)

        self.physical = {
            "numPins": 3,
            "power": {
                "Vin": [],
                "Ground": []
            },
            "aliases": ["out", "gnd", "vcc"],
        }

        self.pmap = [None, "pin", None]

        self.addParameter("pin", "", isSymbol=False)

        self.meta = {
            Arduino: {
                "code": "",

                "inputs": {
                },

                "outputs": {
                    "analog@@name@@": "analogRead(<<pin_@@name@@>>)"
                },

                "declarations": "",
                "setup": "",
                "needs": set()
            },

            Python: {
                "code": "",

                "inputs": {
                },

                "outputs": {
                    "analog@@name@@": "aio_@@name@@.readFloat()"
                },

                "setup": "aio_@@name@@ = mraa.Aio(<<pin_@@name@@>>)\n",
                "needs": set(["mraa"])
            }

        }
        self.addInterface("vIn", ElectricalPort(self, [0], virtual=True))
        self.addInterface("aOut", AnalogOutputPort(self, [0], virtual=True))
        self.addInterface("outInt", OutIntPort(self, "outInt", "analog@@name@@"))