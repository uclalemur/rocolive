from svggen.api.ports.CodePort import InStringPort
from svggen.api.ports.CodePort import OutStringPort
from svggen.api.CodeComponent import CodeComponent
from svggen.api.targets.CppTarget import Cpp

class StringSource(CodeComponent):

    def __init__(self, yamlFile=None, **kwargs):
        CodeComponent.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        self.meta = {
            Cpp: {
                "code": "",

                "inputs": {

                },

                "outputs": {
                    "str@@name@@": "\"Hello World!\\n\""
                },

                "declarations": "",

                "needs": set()
            }
        }
        self.addInterface("outStr", OutStringPort(self, "outStr", "str@@name@@"))
        CodeComponent.define(self, **kwargs)

    def assemble(self):
        CodeComponent.assemble(self)

if __name__ == "__main__":
    ss = StringSource()
