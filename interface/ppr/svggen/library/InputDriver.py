from svggen.api.Driver import Driver
from svggen.api.ports.CodePort import DigitalOutputPort, AnalogOutputPort, PWMOutputPort
from svggen.api.ports.ElectricalPort import ElectricalPort
from svggen.api.composables.VirtualElectricalComposable import VirtualElectricalComposable


class InputDriver(Driver):

    def define(self, **kwargs):
        Driver.define(self)
        self.addInterface("ein", ElectricalPort(self, self.getName(), [1], virtual=True))
        self.addConstant("interface", kwargs["interface"])
        self.addParameter("pin", 15, False)

    def assemble(self):
        parameter = self.getParameter("interface")
        meta = dict()
        name = self.getName()
        pin = self.getParameter("pin")

        if parameter == "Digital":
            self.addInterface("dout", DigitalOutputPort(self, self.getName()))
            meta = {
                "Arduino": {
                    "name": name,
                    "invocation": "digitalRead(%d)" % pin,
                    "declaration": "",
                    "source": "",
                    "setup": "pinMode(%d, INPUT)" % pin,
                    "needs": []
                }
            }

        elif parameter == "Analog":
            self.addInterface("aout", AnalogOutputPort(self, self.getName()))
            meta = {
                "Arduino": {
                    "name": name,
                    "invocation": "analogRead(%d)" % pin,
                    "declaration": "",
                    "source": "",
                    "setup": "",
                    "needs": []
                }
            }

        elif parameter == "PWM":
            self.addInterface("pwmout", PWMOutputPort(self, self.getName()))
            meta = {
                "Arduino": {
                    "name": name,
                    "invocation": "analogRead(%d)" % pin,
                    "declaration": "",
                    "source": "",
                    "setup": "",
                    "needs": []
                }
            }

        self.setParameter("target", "Arduino", forceConstant=True)
        self.setParameter("meta", meta, forceConstant=True)

        self.composables['electrical'] = VirtualElectricalComposable(self.getName(), {
            "numPins": 3,
            "power": {
                "Vin": [0],
                "Ground": [2],
                "pullDown": False,
                "pullUp": False
            }
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
                                                            [(1, self.getParameter("pin"))])
