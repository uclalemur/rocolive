from svggen.library import getComponent

def test_make():
    component = getComponent("StringSource")
    component.setName("hello_world")
    component.makeOutput("output/test")

if __name__ == '__main__':
    test_make()