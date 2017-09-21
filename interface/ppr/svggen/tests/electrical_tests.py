from svggen.library import getComponent

def test_make():
    test = getComponent("DriverTest")
    test.makeOutput("output/driverTest")

if __name__ == '__main__':
    test_make()