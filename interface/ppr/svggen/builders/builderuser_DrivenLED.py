from svggen.api.component import Component
from svggen.library import *
from svggen.library import getComponent
from svggen.library.F import F


c = Component()
c.addSubcomponent("LEDDriver", "LEDDriver")

c.addSubcomponent("LED", "LED")

c.addConnection(("LEDDriver", "eOut"), ("LED", "eIn"))
c.inheritInterface("Din", ("LEDDriver", "Din"))
c.inheritInterface("inInt", ("LEDDriver", "inInt"))
c.toYaml("library/user_DrivenLED.yaml")