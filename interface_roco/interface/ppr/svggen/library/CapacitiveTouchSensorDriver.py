from svggen.api.CodeComponent import CodeComponent
from svggen.api.targets.ArduinoTarget import Arduino
from svggen.api.targets.PythonTarget import Python
from svggen.api.composables.ElectricalComposable import ElectricalComposable
from svggen.api.ports.ElectricalPort import ElectricalPort, DigitalOutputPort
from svggen.api.ports.CodePort import OutIntPort

class CapacitiveTouchSensorDriver(CodeComponent):

    def __init__(self, yamlFile=None, **kwargs):
        CodeComponent.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        self.addParameter("pin", "", isSymbol=False)

        self.meta = {
            Arduino: {
                "code": "",

                "inputs": {
                },

                "outputs": {
                    "digital@@name@@": "digitalRead(<<pin_@@name@@>>)"
                },

                "declarations": "",
                "setup": "",
                "needs": set()
            },

        }
        self.addInterface("eIn", ElectricalPort(self, [0], virtual=True))
        self.addInterface("dOut", DigitalOutputPort(self, [0], virtual=True))
        self.addInterface("outInt", OutIntPort(self, "outInt", "digital@@name@@"))

        CodeComponent.define(self, **kwargs)

    def getPinAlias(self, pin):
        return ["pin", None, None][pin[0]]

    def getTokenSubs(self):
        return {"pin_@@name@@".replace("@@name@@", self.getModifiedName()): self.getParameter("pin")}

    def setPinParameter(self, pinName, pinValue):
        self.setParameter(pinName, pinValue, forceConstant=True)

    def assemble(self):
        self.composables['electrical'] = ElectricalComposable(self.getName(), {
            "numPins": 3,
            "power": {
                "Vin": [0],
                "Ground": [2]
            },
            "aliases": ["first pin", "center pin", "last pin"],
        }, isVirtual=True)
        CodeComponent.assemble(self)