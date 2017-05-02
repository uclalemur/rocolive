from svggen.api.ports.CodePort import InStringPort
from svggen.api.ports.CodePort import OutStringPort
from svggen.api.CodeComponent import CodeComponent

from svggen.api.targets.CppTarget import Cpp

class ReverseString(CodeComponent):

    def __init__(self, yamlFile=None, **kwargs):
        CodeComponent.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        name = self.getName()
        self.meta = {
            Cpp: {
                "code": "std::string @@name@@(std::string str)\n" + \
                    "{\n" + \
                    "    size_t len = str.length();\n\n" + \
                    "    for (int i = 0;i < len / 2;++i)\n" + \
                    "    {\n" + \
                    "        char c = str[i];\n" + \
                    "        str[i] = str[len - i - 1];\n" + \
                    "        str[len - i - 1] = c;\n" + \
                    "    }\n\n" + \
                    "    return str;\n" + \
                    "}\n",

                "inputs": {
                    "inReverse_@@name@@": None
                },

                "outputs": {
                    "reversed_@@name@@": "@@name@@(<<inReverse_@@name@@>>)"
                },

                "declarations": "@@name@@(std::string str);\n",

                "needs": set()
            }
        }
        
        self.addInterface("inStr", InStringPort(self, "inStr", "inReverse_@@name@@"))
        self.addInterface("outStr", OutStringPort(self, "reversed", "reversed_@@name@@"))

        CodeComponent.define(self, **kwargs)

    def assemble(self):
        CodeComponent.assemble(self)


if __name__ == "__main__":
    pass