from svggen.api.ports.CodePort import InStringPort
from svggen.api.ports.CodePort import OutStringPort
from svggen.api.CodeComponent import CodeComponent

from svggen.api.targets.CppTarget import Cpp

class SortString(CodeComponent):

    def __init__(self, yamlFile=None, **kwargs):
        CodeComponent.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        self.meta = {
            Cpp: {
                "code": "",

                "inputs": {
                    "inSort_@@name@@": None
                },

                "outputs": {
                    "sorted_@@name@@": "std::sort(<<inSort_@@name@@>>)"
                },

                "declarations": "",

                "needs": set()
            }
        }
        self.addInterface("inStr", InStringPort(self, "inStr", "inSort_@@name@@"))
        self.addInterface("outStr", OutStringPort(self, "sorted", "sorted_@@name@@"))
        CodeComponent.define(self, **kwargs)


    def assemble(self):
        CodeComponent.assemble(self)


if __name__ == "__main__":
    pass