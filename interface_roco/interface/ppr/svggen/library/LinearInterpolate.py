from svggen.api.ports.CodePort import InIntPort
from svggen.api.ports.CodePort import OutIntPort
from svggen.api.CodeComponent import CodeComponent

from svggen.api.targets.CppTarget import Cpp
from svggen.api.targets.ArduinoTarget import Arduino
from svggen.api.targets.PythonTarget import Python


class LinearInterpolate(CodeComponent):
    def __init__(self, yamlFile=None, **kwargs):
        CodeComponent.__init__(self, yamlFile, **kwargs)

    def define(self, **kwargs):
        self.addParameter("inStart", 0, isSymbol=False)
        self.addParameter("inEnd", 1023, isSymbol=False)
        self.addParameter("outStart", 0, isSymbol=False)
        self.addParameter("outEnd", 255, isSymbol=False)

        name = self.getName()
        self.meta = {
            Cpp: {
                "code": "int interpolate_@@name@@(int t)\n" + \
                        "{\n" + \
                        "    if (t < <<inStart_@@name@@>> || t > <<inEnd_@@name@@>>) return 0;\n" + \
                        "    return ((t - <<inStart_@@name@@>>) * <<outEnd_@@name@@>>) / (<<inEnd_@@name@@>> - <<inStart_@@name@@>>) + ((<<inEnd_@@name@@>> - t) * <<outStart_@@name@@>>) / (<<inEnd_@@name@@>> - <<inStart_@@name@@>>);\n" + \
                        "}\n",

                "inputs": {
                    "in@@name@@": None
                },

                "outputs": {
                    "out@@name@@": "interpolate_@@name@@(<<in@@name@@>>)"
                },

                "declarations": "int interpolate_@@name@@(int t);\n",

                "needs": set()
            },

            Arduino: {
                "code": "int interpolate_@@name@@(int t)\n" + \
                        "{\n" + \
                        "    if (t < <<inStart_@@name@@>> || t > <<inEnd_@@name@@>>) return 0;\n" + \
                        "    return ((t - <<inStart_@@name@@>>) * <<outEnd_@@name@@>>) / (<<inEnd_@@name@@>> - <<inStart_@@name@@>>) + ((<<inEnd_@@name@@>> - t) * <<outStart_@@name@@>>) / (<<inEnd_@@name@@>> - <<inStart_@@name@@>>);\n" + \
                        "}\n",


                "inputs": {
                    "in@@name@@": None
                },

                "outputs": {
                    "out@@name@@": "interpolate_@@name@@(<<in@@name@@>>)"
                },

                "declarations": "int interpolate_@@name@@(int t);\n",

                "setup": "",

                "needs": set()
            },
            Python: {
                "code": "def interpolate_@@name@@(t):\n" + \
                        "    if t < <<inStart_@@name@@>> or t > <<inEnd_@@name@@>>:\n"
                        "        return 0\n" + \
                        "    return ((t - <<inStart_@@name@@>>) * <<outEnd_@@name@@>>) / (<<inEnd_@@name@@>> - <<inStart_@@name@@>>) + ((<<inEnd_@@name@@>> - t) * <<outStart_@@name@@>>) / (<<inEnd_@@name@@>> - <<inStart_@@name@@>>)\n" + \
                        "\n",

                "inputs": {
                    "in@@name@@": None
                },

                "outputs": {
                    "out@@name@@": "interpolate_@@name@@(<<in@@name@@>>)"
                },

                "setup": "",

                "needs": set()
            },
        }

        self.addInterface("inInt", InIntPort(self, "inStr", "in@@name@@"))
        self.addInterface("outInt", OutIntPort(self, "outInt", "out@@name@@"))

        CodeComponent.define(self, **kwargs)

    def assemble(self):
        CodeComponent.assemble(self)


if __name__ == "__main__":
    pass