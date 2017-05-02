from svggen.api.CodeComponent import CodeComponent
from svggen.api.composables.ElectricalComposable import ElectricalComposable


class Driver(CodeComponent):
    def __init__(self, yamlFile=None, **kwargs):
        self.pmap = []
        self.physical = {
            "numPins": 0,
            "power": {
                "Vin": [],
                "Ground": []
            },
            "aliases": []
        }
        CodeComponent.__init__(self, yamlFile, **kwargs)

    def getPinAlias(self, pin):
        if not isinstance(pin, list):
            return [self.pmap[pin]]
        if isinstance(pin[0], int):
            return [self.pmap[i] for i in pin]
        return pin

    def setPinParameter(self, pinNames, pinValues):
        if isinstance(pinNames, list):
            for (pinName, pinValue) in zip(pinNames, pinValues):
                self.setParameter(pinName, pinValue, forceConstant=True)
        else:
            self.setParameter(pinNames, pinValues, forceConstant=True)

    def getTokenSubs(self):
        return dict([(key + "_" + self.getModifiedName(), val) for key, val in self.parameters.iteritems()])

    def assemble(self):
        self.composables['electrical'] = ElectricalComposable(self.getName(), self.physical, isVirtual=True)
        CodeComponent.assemble(self)