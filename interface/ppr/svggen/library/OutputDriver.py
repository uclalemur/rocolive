from svggen.api.Driver import Driver
from svggen.api.ports.CodePort import DigitalInputPort, AnalogInputPort, PWMInputPort
from svggen.api.ports.ElectricalPort import ElectricalPort
from svggen.api.composables.VirtualElectricalComposable import VirtualElectricalComposable


class OutputDriver(Driver):

    def define(self, **kwargs):
        Driver.define(self)
        self.addInterface("eout", ElectricalPort(self, self.getName(), [0], virtual=True))
        self.addParameter("interface", kwargs["interface"], False)
        self.addParameter("pin", 9, False)

    def assemble(self):
        parameter = self.getParameter("interface")
        name = self.getName()
        pin = self.getParameter("pin")
        meta = dict()

        if parameter == "Digital":
            self.addInterface("din", DigitalInputPort(self, self.getName(), "data"))
            meta = {
                "Arduino": {
                    "name": name,
                    "invocation": "digitalWrite(%d, @@data@@)" % pin,
                    "declaration": "",
                    "source": "",
                    "setup": "pinMode(%d, OUTPUT)" % pin,
                    "needs": []
                }
            }

        elif parameter == "Analog":
            self.addInterface("ain", AnalogInputPort(self,self.getName(), "data"))
            meta = {
                "Arduino": {
                    "name": name,
                    "invocation": "analogWrite(%d, @@data@@)" % pin,
                    "declaration": "",
                    "source": "",
                    "setup": "pinMode(%d, OUTPUT)" % pin,
                    "needs": []
                }
            }

        elif parameter == "PWM":
            self.addInterface("pwmin", PWMInputPort(self, self.getName(), "data"))
            meta = {
                "Arduino": {
                    "name": name,
                    "invocation": "analogWrite(%d, @@data@@)" % pin,
                    "declaration": "",
                    "source": "",
                    "setup": "pinMode(%d, OUTPUT)" % pin,
                    "needs": []
                }
            }

        self.setParameter("target", "Arduino", forceConstant=True)
        self.setParameter("meta", meta, forceConstant=True)

        self.composables['electrical'] = VirtualElectricalComposable(self.getName(), {
            "numPins": 2,
            "power": {
                "Vin": [0],
                "Ground": [1],
                "pullDown": True,
                "pullUp": False
            },
        })
        Driver.assemble(self)


    def setContainer(self, virtualObject, containerObject, virtualParams, containerParams, types=list(['code'])):
        for (key, val) in virtualParams.iteritems():
            self.setParameter(key, val, forceConstant=True)

        for type in types:
            containerComposable = containerObject.composables[type]
            if type == 'code':
                self.composables['code'].setContainer(containerComposable)
            elif type == 'electrical':
                self.composables['electrical'].setContainer(virtualObject.getName(),
                                                            containerObject.getName(),
                                                            containerObject.composables['electrical'],
                                                            [(0, self.getParameter("pin"))])

