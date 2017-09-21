from svggen.api.ports.CodePort import *
from svggen.api.CodeComponent import CodeComponent
from svggen.api.targets.CppTarget import Cpp

class G(CodeComponent):

    def __init__(self, yamlFile=None, **kwargs):
        CodeComponent.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        name = self.getName()
        self.meta = {
            Cpp: {
                "code": "int %s(int x, int y)\n" % name + \
                        "{\n" + \
                        "    return  x + y;\n" + \
                        "}\n",

                "inputs": {
                    "inG1": None,
                    "inG2": None
                },

                "outputs": {
                    "outG": "%s(<<inG1>>, <<inG2>>)" % name
                },

                "needs": set()
            }
        }

        self.addInterface("input1", InIntPort(self, "input1", "inG1"))
        self.addInterface("input2", InIntPort(self, "input2", "inG2"))
        self.addInterface("output", OutIntPort(self, "output", "outG"))
        CodeComponent.define(self, **kwargs)

    def assemble(self):
        CodeComponent.assemble(self)


if __name__ == "__main__":
    pass