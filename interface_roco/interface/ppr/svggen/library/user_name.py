from svggen.api.targets.PythonTarget import Python
from svggen.api.targets.ArduinoTarget import Arduino

from svggen.api.CodeComponent import CodeComponent



class user_name(CodeComponent):

	def __init__(self,  yamlFile=None, **kwargs):
		CodeComponent.__init__(self, yamlFile, **kwargs)
		name = self.getName()

	def define(self, **kwargs):
		self.meta = {
			Arduino: {
				"code": ""
				,

				"inputs": {
				},

				"outputs": {
				},

				"declarations": ""
				,

				"setup": "",

				"needs": set()
			},

		}

		CodeComponent.define(self, **kwargs)

	def assemble(self):
		CodeComponent.assemble(self)

if __name__ == "__main__":
	pass

