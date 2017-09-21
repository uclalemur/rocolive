from svggen.api.ports.CodePort import InStringPort
from svggen.api.ports.CodePort import OutStringPort
from svggen.api.CodeComponent import CodeComponent
from svggen.api.targets.CppTarget import Cpp
from svggen.api.targets.ArduinoTarget import Arduino

class GetString(CodeComponent):

    def __init__(self, yamlFile=None, **kwargs):
        CodeComponent.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        CodeComponent.define(self, **kwargs)
        self.meta = {
            Arduino: {
                "code": "",

                "inputs": {
                },

                "outputs": {
                    "str@@name@@": "Serial.readString()"
                },

                "declarations": "",

                "setup": "Serial.begin(115200)",

                "needs": set()
            }
        }
        self.addInterface("outStr", OutStringPort(self, "outStr", "str@@name@@"))

    def assemble(self):
        CodeComponent.assemble(self)

