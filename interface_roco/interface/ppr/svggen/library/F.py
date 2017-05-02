from svggen.api.ports.CodePort import *
from svggen.api.CodeComponent import CodeComponent
from svggen.api.targets.CppTarget import Cpp

class F(CodeComponent):

    def __init__(self, yamlFile=None, **kwargs):
        CodeComponent.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        name = self.getName()
        self.meta = {
            Cpp: {
                "code": "int @@name@@1(int x)\n" % name + \
                        "{\n" + \
                        "    return  x * x;\n" + \
                        "}\n" + \
                        "\n" + \
                        "int @@name@@2(int x)\n" % name + \
                        "{\n" + \
                        "    return  x * x * x;\n" + \
                        "}\n",

                "inputs": {
                    "@@name@@inF": None
                },

                "outputs": {
                    "@@name@@outF1": "@@name@@1(<<inF>>)" % name,
                    "@@name@@outF2": "@@name@@2(<<inF>>)" % name
                },

                "declarations": "int @@name@@1(int x);\n" + \
                                "int @@name@@2(int x);\n",

                "needs": set()
            }
        }

        self.addInterface("input", InIntPort(self, "input", "@@name@@inF"))
        self.addInterface("output1", OutIntPort(self, "output1", "@@name@@outF1"))
        self.addInterface("output2", OutIntPort(self, "output2", "@@name@@outF2"))
        CodeComponent.define(self, **kwargs)

    def assemble(self):
        CodeComponent.assemble(self)


if __name__ == "__main__":
    pass

