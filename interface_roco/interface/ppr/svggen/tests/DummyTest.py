from svggen.library import *

def dummy_test():
    dummy = getComponent("Dummy")
    dummy.makeOutput("output/dummy")

if __name__ == "__main__":
    dummy_test()