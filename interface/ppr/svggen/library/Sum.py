from svggen.api.component import Component
from svggen.api.composables.CodeComposable import CodeComposable

from svggen.api.ports.CodePort import InIntPort
from svggen.api.ports.CodePort import OutIntPort
from svggen.api.CodeComponent import CodeComponent

class Sum(CodeComponent):

    def define(self, **kwargs):
        CodeComponent.define(self, **kwargs)
        self.addConstant("num_summands", 2)

    def assemble(self):
        name = self.getName()
        num_summands = self.getParameter("num_summands")

        self.setParameter("meta", {
            "cpp": {
                "name": name,
                "invocation": "".join(["@@InInt%d@@ + " % i for i in range(1, num_summands + 1)])[0:-3],
                "declaration": "",
                "source": "",
                "needs": list()
            }
        }, forceConstant=True)

        for i in range(1, num_summands + 1):
            self.addInterface("inInt%d" % i, InIntPort(self, name, "InInt % d" % i, True))

        self.addInterface("sum", OutIntPort(self, name))
        CodeComponent.assemble(self)
