from svggen.api.ports.CodePort import InPort
from svggen.api.ports.CodePort import OutPort
from svggen.api.CodeComponent import CodeComponent
from svggen.api.targets.CppTarget import Cpp
from svggen.api.targets.ArduinoTarget import Arduino
from svggen.api.targets.PythonTarget import Python

class SplitThree(CodeComponent):

    def __init__(self, yamlFile=None, **kwargs):
        CodeComponent.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        self.meta = {
            Cpp: {
                "code": "",

                "inputs": {
                    "in@@name@@": None
                },

                "outputs": {
                    "out1@@name@@": "<<in@@name@@>>",
                    "out2@@name@@": "<<in@@name@@>>",
                    "out3@@name@@": "<<in@@name@@>>"

                },

                "declarations": "",

                "needs": set()
            },

            Arduino: {
                "code": "",

                "inputs": {
                    "in@@name@@": None
                },

                "outputs": {
                    "out1@@name@@": "<<in@@name@@>>",
                    "out2@@name@@": "<<in@@name@@>>",
                    "out3@@name@@": "<<in@@name@@>>"

                },

                "declarations": "",
                "setup": "",

                "needs": set()
            },

            Python: {
                "code": "",

                "inputs": {
                    "in@@name@@": None
                },

                "outputs": {
                    "out1@@name@@": "<<in@@name@@>>",
                    "out2@@name@@": "<<in@@name@@>>",
                    "out3@@name@@": "<<in@@name@@>>"

                },

                "setup": "",

                "needs": set()
            }
        }

        self.addInterface("in", InPort(self, "in", "in@@name@@"))
        self.addInterface("out1", OutPort(self, "out1", "out1@@name@@"))
        self.addInterface("out2", OutPort(self, "out2", "out2@@name@@"))
        self.addInterface("out3", OutPort(self, "out3", "out3@@name@@"))

        CodeComponent.define(self, **kwargs)

    def assemble(self):
        CodeComponent.assemble(self)

if __name__ == "__main__":
    ss = SplitThree()
