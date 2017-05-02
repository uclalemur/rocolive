from svggen.api.component import Component
from svggen.library import *
from svggen.library import getComponent
from svggen.library.F import F


c = Component()
c.addSubcomponent("esp8266", "NodeMCU")

c.addSubcomponent("led", "DrivenLED")

c.addSubcomponent("button", "UIButton")
c.setSubParameter(("button", "text"), "Button")

c.addConnection(("esp8266", "do0"), ("led", "Din"))
c.addConnection(("button", "outInt"), ("led", "inInt"))
c.toYaml("library/user_button_led.yaml")