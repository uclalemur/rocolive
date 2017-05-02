from svggen.library import *
from svggen.library.PrintString import PrintString

def test_make():
    fg = getComponent("GetAndPutString")
    fg.makeOutput("output/getandput")

if __name__ == '__main__':
    test_make()
