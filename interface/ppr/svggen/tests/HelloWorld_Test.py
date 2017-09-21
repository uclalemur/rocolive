from svggen.library import getComponent

def test_make():
    component = getComponent("PrintString")
    component.setName("hello_world")
    component.makeOutput("output/helloworld")

if __name__ == '__main__':
    test_make()