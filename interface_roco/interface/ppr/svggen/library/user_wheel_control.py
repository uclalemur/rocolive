from svggen.api.targets.PythonTarget import Python
from svggen.api.targets.ArduinoTarget import Arduino

from svggen.api.CodeComponent import CodeComponent
from svggen.api.ports.CodePort import InIntPort
from svggen.api.ports.CodePort import OutIntPort



class user_wheel_control(CodeComponent):

	def __init__(self,  yamlFile=None, **kwargs):
		CodeComponent.__init__(self, yamlFile, **kwargs)
		name = self.getName()

	def define(self, **kwargs):
		self.meta = {
			Arduino: {
				"code": ""				,

				"inputs": {
					"input_val@@name@@": None,
				},

				"outputs": {
					"magnitude@@name@@" : "@@name@@item",
				},

				"declarations": ("int @@name@@item;\n")				,

				"setup":  "@@name@@item = (int)(0);\n" 
				,

				"loop": ( "    @@name@@item = (int)(0);\n" 
					"    \n" )
				,

				"needs": set()
			},

		}

		self.addInterface("input_val", InIntPort(self, "input_val", "input_val@@name@@"))
		self.addInterface("magnitude", OutIntPort(self, "magnitude", "magnitude@@name@@"))
		CodeComponent.define(self, **kwargs)

	def assemble(self):
		CodeComponent.assemble(self)

if __name__ == "__main__":
	pass

