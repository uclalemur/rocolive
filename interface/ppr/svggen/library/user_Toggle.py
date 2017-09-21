from svggen.api.targets.PythonTarget import Python
from svggen.api.targets.ArduinoTarget import Arduino

from svggen.api.CodeComponent import CodeComponent
from svggen.api.ports.CodePort import OutIntPort



class user_Toggle(CodeComponent):

	def __init__(self,  yamlFile=None, **kwargs):
		CodeComponent.__init__(self, yamlFile, **kwargs)
		name = self.getName()

	def define(self, **kwargs):
		self.meta = {
			Arduino: {
				"code": ("void @@name@@tog() {\n"
					"  @@name@@count = (int)(!@@name@@count);\n"
					"  delay( 1000 );\n"
					"}\n"
					
					
					")
				,

				"inputs": {
				},

				"outputs": {
					"ledLevel@@name@@" : "@@name@@count",
					"dummy" : "@@name@@tog();",
				},

				"declarations": ("void @@name@@tog();\n"
					"int @@name@@count;\n")				,

				"setup": "",

				"needs": set()
			},

		}

		self.addInterface("ledLevel", OutIntPort(self, "ledLevel", "ledLevel@@name@@"))
		CodeComponent.define(self, **kwargs)

	def assemble(self):
		CodeComponent.assemble(self)

if __name__ == "__main__":
	pass

