from svggen.api.CodeComponent import CodeComponent
from svggen.api.ports.CodePort import InIntPort
from svggen.api.ports.CodePort import OutIntPort


class Blue(CodeComponent):
    def define(self, **kwargs):
        CodeComponent.define(self, **kwargs)
        self.addInterface("inInt", InIntPort(self, self.getName(), "inInt", True))
        self.addInterface("outInt", OutIntPort(self, self.getName()))

    def assemble(self):
        name = self.getName()
        meta = {
            "Arduino": {
                "name": name,
                "invocation": "%s(@@inInt@@)" % name,
                "declaration": "int %s(int x)" % name,
                "source": "int %s(int x)\n" % name +
                          "{\n" +
                          "    return x <= 511 ? 0 : ((x - 512) * 255) / 511;\n" +
                          "}\n\n",
                "setup": "",
                "needs": []
            },
        }
        self.setParameter("meta", meta, forceConstant=True)
        CodeComponent.assemble(self)

