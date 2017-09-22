from svggen.api.component import Component
from svggen.library import *

led = Component()
led.addSubcomponent("led", "LED")
led.addSubcomponent("driver", "LEDDriver")
led.addConnection(("driver", "eOut"), ("led", "eIn"))
led.inheritInterface("Din", ("driver", "Din"))
led.inheritInterface("inInt", ("driver", "inInt"))
led.toYaml("library/DrivenLED.yaml")

servo = Component()
servo.addSubcomponent("servo", "Servo")
servo.addSubcomponent("driver", "ServoDriver")
servo.addConnection(("driver", "eOut"), ("servo", "eIn"))
servo.inheritInterface("PWMin", ("driver", "PWMin"))
servo.inheritInterface("inInt", ("driver", "inInt"))
servo.toYaml("library/DrivenServo.yaml")

motor = Component()
motor.addSubcomponent("motor", "Motor")
motor.addSubcomponent("driver", "MotorDriver")
motor.addConnection(("driver", "eOut"), ("motor", "eIn"))
motor.inheritInterface("PWMin", ("driver", "PWMin"))
motor.inheritInterface("inInt", ("driver", "inInt"))
motor.toYaml("library/DrivenMotor.yaml")

u = Component()
u.addSubcomponent("sensor", "UltrasonicSensor")
u.addSubcomponent("driver", "UltrasonicSensorDriver")
u.addConnection(("driver", "tOut"), ("sensor", "trigger"))
u.addConnection(("driver", "eOut"), ("sensor", "echo"))
u.inheritInterface("triggerIn", ("driver", "triggerIn"))
u.inheritInterface("echoIn", ("driver", "echoIn"))
u.inheritInterface("outInt", ("driver", "outInt"))
u.toYaml("library/DrivenUltrasonicSensor.yaml")

microphone = Component()
microphone.addSubcomponent("microphone", "Microphone")
microphone.addSubcomponent("driver", "MicrophoneDriver")
microphone.addConnection(("microphone", "vOut"), ("driver", "vIn"))
microphone.inheritInterface("aOut", ("driver", "aOut"))
microphone.inheritInterface("outInt", ("driver", "outInt"))
microphone.toYaml("library/DrivenMicrophone.yaml")


