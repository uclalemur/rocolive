from svggen.library import *

## getColor
c = Component()
c.addSubcomponent("Red", "LinearInterpolate")
c.setSubParameter(("Red", "inStart"), 0)
c.setSubParameter(("Red", "inEnd"), 511)
c.setSubParameter(("Red", "outStart"), 255)
c.setSubParameter(("Red", "outEnd"), 0)

c.addSubcomponent("Green1", "LinearInterpolate")
c.setSubParameter(("Green1", "inStart"), 0)
c.setSubParameter(("Green1", "inEnd"), 511)
c.setSubParameter(("Green1", "outStart"), 0)
c.setSubParameter(("Green1", "outEnd"), 255)

c.addSubcomponent("Green2", "LinearInterpolate")
c.setSubParameter(("Green2", "inStart"), 511)
c.setSubParameter(("Green2", "inEnd"), 1023)
c.setSubParameter(("Green2", "outStart"), 255)
c.setSubParameter(("Green2", "outEnd"), 0)

c.addSubcomponent("Blue", "LinearInterpolate")
c.setSubParameter(("Blue", "inStart"), 511)
c.setSubParameter(("Blue", "inEnd"), 1023)
c.setSubParameter(("Blue", "outStart"), 0)
c.setSubParameter(("Blue", "outEnd"), 255)

c.addSubcomponent("add", "Add")
c.addSubcomponent("Split", "SplitFour")

c.addConnection(("Split", "out1"), ("Red", "inInt"))
c.addConnection(("Split", "out2"), ("Green1", "inInt"))
c.addConnection(("Split", "out3"), ("Green2", "inInt"))
c.addConnection(("Split", "out4"), ("Blue", "inInt"))
c.addConnection(("Green1", "outInt"), ("add", "inInt1"))
c.addConnection(("Green2", "outInt"), ("add", "inInt2"))

c.inheritInterface("red", ("Red", "outInt"))
c.inheritInterface("green", ("add", "outInt"))
c.inheritInterface("blue", ("Blue", "outInt"))

c.inheritInterface("inInt", ("Split", "in"))

c.toYaml("library/GetColor.yaml")


#----------------------------------------------------------------------------------------------------------------------#
#Driven RGBLED
c = Component()
c.addSubcomponent("rgb_driver", "RGBLEDDriver")
c.addSubcomponent("rgbled", "RGBLED")
c.addConnection(("rgb_driver", "rOut"), ("rgbled", "red"))
c.addConnection(("rgb_driver", "gOut"), ("rgbled", "green"))
c.addConnection(("rgb_driver", "bOut"), ("rgbled", "blue"))
c.inheritInterface("inRed", ("rgb_driver", "inRed"))
c.inheritInterface("inGreen", ("rgb_driver", "inGreen"))
c.inheritInterface("inBlue", ("rgb_driver", "inBlue"))
c.inheritInterface("rPWM", ("rgb_driver", "rPWM"))
c.inheritInterface("gPWM", ("rgb_driver", "gPWM"))
c.inheritInterface("bPWM", ("rgb_driver", "bPWM"))
c.toYaml("library/DrivenRGBLED.yaml")

#----------------------------------------------------------------------------------------------------------------------#
#Driven Pot
c = Component()
c.addSubcomponent("pot", "Pot")
c.addSubcomponent("potDriver", "PotDriver")
c.addConnection(("pot", "vOut"), ("potDriver", "vIn"))
c.inheritInterface("outInt", ("potDriver", "outInt"))
c.inheritInterface("aOut", ("potDriver", "aOut"))
c.toYaml("library/DrivenPot.yaml")


#PotDemo1
c = Component()
c.addSubcomponent("pot", "DrivenPot")
c.addSubcomponent("rgbled", "DrivenRGBLED")
c.addSubcomponent("getColor", "GetColor")
c.addSubcomponent("arduino", "ArduinoUno")

# Software Connections
c.addConnection(("pot", "outInt"), ("getColor", "inInt"))
c.addConnection(("getColor", "red"), ("rgbled", "inRed"))
c.addConnection(("getColor", "green"), ("rgbled", "inGreen"))
c.addConnection(("getColor", "blue"), ("rgbled", "inBlue"))

# Hardware Connections
c.addConnection(("pot", "aOut"), ("arduino", "a1"))
c.addConnection(("rgbled", "rPWM"), ("arduino", "pwm1"))
c.addConnection(("rgbled", "gPWM"), ("arduino", "pwm2"))
c.addConnection(("rgbled", "bPWM"), ("arduino", "pwm3"))

c.toYaml("library/LiveDemo1.yaml")

#PotDemo2
c = Component()
c.addSubcomponent("pot", "DrivenPot")
c.addSubcomponent("rgbled", "DrivenRGBLED")
c.addSubcomponent("getColor", "SplitThree")
c.addSubcomponent("arduino", "ArduinoUno")

# Software Connections
c.addConnection(("pot", "outInt"), ("getColor", "in"))
c.addConnection(("getColor", "out1"), ("rgbled", "inRed"))
c.addConnection(("getColor", "out2"), ("rgbled", "inGreen"))
c.addConnection(("getColor", "out3"), ("rgbled", "inBlue"))

# Hardware Connections
c.addConnection(("pot", "aOut"), ("arduino", "a1"))
c.addConnection(("rgbled", "rPWM"), ("arduino", "pwm1"))
c.addConnection(("rgbled", "gPWM"), ("arduino", "pwm2"))
c.addConnection(("rgbled", "bPWM"), ("arduino", "pwm3"))

c.toYaml("library/LiveDemo2.yaml")

# UIDemo1
c = Component()
c.addSubcomponent("led", "DrivenLED")
c.addSubcomponent("button", "UIButton")
c.addSubcomponent("ESP8266", "NodeMCU")

c.addConnection(("button", "outInt"), ("led", "inInt"))
c.addConnection(("ESP8266", "do0"), ("led", "Din"))

c.toYaml("library/LiveDemo3.yaml")

#UIDemo2
c = Component()
c.addSubcomponent("servo", "DrivenServo")
c.addSubcomponent("slider", "UISlider")
c.setSubParameter(("slider", "max"), 180)
c.addSubcomponent("ESP8266", "NodeMCU")

c.addConnection(("slider", "outInt"), ("servo", "inInt"))
c.addConnection(("ESP8266", "do0"), ("servo", "PWMin"))

c.toYaml("library/LiveDemo4.yaml")