from svggen.api.ElectricalComponent import ElectricalComponent
from svggen.api.ports.ElectricalPort import ElectricalPort

class IREmitter(ElectricalComponent):

    def __init__(self, yamlFile=None, **kwargs):
        ElectricalComponent.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        ElectricalComponent.define(self)

        self.physical =  {
            "numPins": 2,
            "power": {
                "Vin": [0],
                "Ground": [1]
            },
            "aliases": ["anode", "cathode"]
        }

        self.addInterface('eIn', ElectricalPort(self, [0]))

    def assemble(self):
        ElectricalComponent.assemble(self)
