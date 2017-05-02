from svggen.api.component import Component
from svggen.api.composables.CodeComposable import CodeComposable

from svggen.api.ports.CodePort import InIntPort
from svggen.api.ports.CodePort import OutIntPort
from svggen.api.CodeComponent import CodeComponent

class Divide(CodeComponent):

    def define(self, **kwargs):
        CodeComponent.define(self, **kwargs)
        name = self.getName()
        self.setParameter("meta", {
            "cpp": {
                "name": name,
                "invocation": "@@InInt1@@ / @@InInt2@@",
                "declaration": "",
                "source": "",
                "needs": list()
            }
        }, forceConstant=True)
        self.addInterface("quotient", OutIntPort(self, name))
        self.addInterface("numerator", InIntPort(self, name, "InInt1", True))
        self.addInterface("denominator", InIntPort(self, name, "InInt2", True))


