from svggen.library import getComponent

def test_make():
    component = getComponent("GetString")
    component.setName("get_string")
    component.makeOutput("output/getstring")

if __name__ == '__main__':
    test_make()