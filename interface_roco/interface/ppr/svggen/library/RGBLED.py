from svggen.api.ElectricalComponent import ElectricalComponent
from svggen.api.ports.ElectricalPort import ElectricalPort



class RGBLED(ElectricalComponent):

    def __init__(self, yamlFile=None, **kwargs):
        ElectricalComponent.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        ElectricalComponent.define(self)

        self.physical = {
            "numPins": 4,
            "power": {
                "Vin": [],
                "Ground": [1],
            },
            "aliases": ["red pin", "cathode", "green pin", "blue pin"],
        }

        self.addInterface("red", ElectricalPort(self, [0]))
        self.addInterface("green", ElectricalPort(self, [2]))
        self.addInterface("blue", ElectricalPort(self, [3]))

    def assemble(self):
        ElectricalComponent.assemble(self)


"""
class RGBLED(ElectricalComponent):

    def define(self, **kwargs):
        ElectricalComponent.define(self)
        self.setParameter('pulldown', True, forceConstant=True)

        self.setParameter("physical", {
            "numPins": 4,
            "power": {
                "Vin": [],
                "Ground": [1],
                "pullDown": self.getParameter("pulldown"),
                "pullUp": self.getParameter("pullup")
            },
        }, forceConstant=True)

        self.addInterface('rIn', ElectricalPort(self, self.getName(), [0]))
        self.addInterface('gIn', ElectricalPort(self, self.getName(), [2]))
        self.addInterface('bIn', ElectricalPort(self, self.getName(), [3]))

"""