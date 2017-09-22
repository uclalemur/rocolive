def make_string_literal(string):
    """
    When inserting a string literal into an output source file, eg. "Hello World\n",
    we do not want to print "Hello World\n" (which is "Hello World" followed by a newline),
    but rather, "Hello World\\n", (which is "Hello World" followed by the sequence "\n").
    """

    string = string.replace("\\", "\\\\")
    string = string.replace("\"", "\\\"")
    string = string.replace("\n", "\\n")
    string = string.replace("\t", "\\t")
    string = string.replace("\r", "\\r")

    return string