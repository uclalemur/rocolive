from svggen.api.ElectricalComponent import ElectricalComponent
from svggen.api.ports.ElectricalPort import ElectricalPort



class CapacitiveTouchSensor(ElectricalComponent):

    def __init__(self, yamlFile=None, **kwargs):
        ElectricalComponent.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        ElectricalComponent.define(self)

        self.physical = {
            "numPins": 3,
            "power": {
                "Vin": [1],
                "Ground": [2],
            },
            "aliases": ["sig", "vcc", "ground"],
        }

        self.addInterface("sig", ElectricalPort(self, [0]))

    def assemble(self):
        ElectricalComponent.assemble(self)