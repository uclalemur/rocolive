from svggen.api.component import Component
from svggen.api.composables.CodeComposable import CodeComposable

from svggen.api.ports.CodePort import InIntPort
from svggen.api.ports.CodePort import OutStringPort
from svggen.api.CodeComponent import CodeComponent

class IntToString(CodeComponent):

    def define(self, **kwargs):
        CodeComponent.define(self, **kwargs)
        name = self.getName()

        self.setParameter("meta", {
            "cpp": {
                "name": name,
                "invocation": "%s(@@InInt@@)" % name,
                "declaration": "std::string %s(int n);" % name,
                "source": \
                    "std::string %s(int n)\n" % name + \
                    "{\n" + \
                    "    return std::to_string(n);\n"
                    "}\n",
                "needs": ["iostream", "string"]
            }
        }, forceConstant=True)

        self.addInterface("outStr", OutStringPort(self, name))
        self.addInterface("inInt", InIntPort(self, name, "InInt", True))