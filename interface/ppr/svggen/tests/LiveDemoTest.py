from svggen.library import getComponent

def test_make():
    test2 = getComponent("LiveDemo4")
    test2.makeOutput("output/demo4")

if __name__ == '__main__':
    test_make()