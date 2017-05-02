from svggen.api.component import Component
from svggen.api.composables.CodeComposable import CodeComposable

from svggen.api.ports.InStringPort import InStringPort
from svggen.api.CodeComponent import CodeComponent

class PrintStringArg(CodeComponent):

    def define(self, **kwargs):
        CodeComponent.define(self, **kwargs)

    def assemble(self):
        functionName = "print_string"
        functionCall = "print_string(@@InStr@@)"
        source = \
            "void print_string(std::string toPrint)" + \
            "{\n" + \
            "    std::cout << toPrint << std::endl;\n" + \
            "}\n\n"
        functionDeclaration = "void print_string(std::string);"
        needs = ["iostream", "string"]


        code = CodeComposable(functionName, functionCall, functionDeclaration, source, needs)
        self.composables['code'] = code
        self.addInterface("inStr", InStringPort(self, functionName, "InStr", True))

if __name__ == "__main__":
    ps = PrintStringArg()