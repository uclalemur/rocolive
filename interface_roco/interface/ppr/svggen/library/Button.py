from svggen.api.ElectricalComponent import ElectricalComponent
from svggen.api.ports.ElectricalPort import ElectricalPort


"""
class Button(ElectricalComponent):

    def __init__(self, yamlFile=None, **kwargs):
        ElectricalComponent.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        self.physical = {
            "pin1": None,
            "pin2": None
        }

        self.addInterface("ein", ElectricalPort(self, "ein", ["pin1"]))
        self.addInterface("eout", ElectricalPort(self, "eout", ["pin2"]))

        ElectricalComponent.define(self)


    def assemble(self):
        ElectricalComponent.assemble(self)

"""

class Button(ElectricalComponent):

    def define(self, **kwargs):
        ElectricalComponent.define(self)

        self.setParameter("physical", {
            "name": self.getName(),
            "numPins": 2,
            "power": {
                "Vin": [0],
                "Ground": [1],
                "pullDown": self.getParameter("pulldown"),
                "pullUp": self.getParameter("pullup")
            }
        }, forceConstant=True)

        self.addInterface("ein", ElectricalPort(self, self.getName(), [0]))
        self.addInterface("eout", ElectricalPort(self, self.getName(), [1]))

