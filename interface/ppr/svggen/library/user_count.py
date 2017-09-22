from svggen.api.targets.PythonTarget import Python
from svggen.api.targets.ArduinoTarget import Arduino

from svggen.api.CodeComponent import CodeComponent
from svggen.api.ports.CodePort import OutIntPort



class user_count(CodeComponent):

	def __init__(self,  yamlFile=None, **kwargs):
		CodeComponent.__init__(self, yamlFile, **kwargs)
		name = self.getName()

	def define(self, **kwargs):
		self.meta = {
			Arduino: {
				"code": ("void @@name@@toggle();\n"
					"int @@name@@c;\n"
					"void @@name@@toggle() {\n"
					"  @@name@@c = (int)(!@@name@@c);\n"
					"}\n"
					
					)
				,

				"inputs": {
				},

				"outputs": {
					"tog@@name@@" : "@@name@@c",
				},

				"declarations": ("void @@name@@toggle();\n"
					"int @@name@@c;\n")				,

				"setup": ( "@@name@@c = (int)(0);\n" 
					"if (@@name@@c == 0) {\n" 
					"    @@name@@c = (int)(0);\n" 
					"}\n" )
				,

				"needs": set()
			},

		}

		self.addInterface("tog", OutIntPort(self, "tog", "tog@@name@@"))
		CodeComponent.define(self, **kwargs)

	def assemble(self):
		CodeComponent.assemble(self)

if __name__ == "__main__":
	pass

