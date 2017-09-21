from svggen.api.component import Component
from svggen.api.composables.ElectricalComposable import ElectricalComposable


class ElectricalComponent(Component):

    def __init__(self, yamlFile=None, **kwargs):
        Component.__init__(self, yamlFile=None, **kwargs)
        self.physical = dict()
        self.pinIndices = dict()

    def define(self, **kwargs):
        pass

    def setPinParameter(self, pinName, pinValue):
        pass

    def pinIndices(self, pins):
        return [0 for i in pins]

    def assemble(self):
        self.composables['electrical'] = ElectricalComposable(self.getName(), self.physical)

