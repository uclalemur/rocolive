from svggen.api.targets.CppTarget import Cpp
from re import findall
import os, errno

class Arduino(Cpp):

    @staticmethod
    def new():
        return {
            "code": "",
            "declarations": "",
            "setup": "",
            "loop": "",
            "inputs": {},
            "outputs": {},
            "needs": set(),
            "interface": {
                "html": "",
                "style": "",
                "js": "",
                "event": "",
            }
        }

    def __init__(self, composable, meta, name=""):
        Cpp.__init__(self, composable, meta, name)
        if "interface" not in self.meta.keys():
            self.meta["interface"] = {
                "html": "",
                "style": "",
                "js": "",
                "event": ""
            }

        if "loop" not in self.meta.keys():
            self.meta["loop"] = ""

        if self.meta["interface"]["html"] or self.meta["interface"]["style"] or \
           self.meta["interface"]["js"] or self.meta["interface"]["event"]:
            self.interface = True
        else:
            self.interface = False

    def __str__(self):
        return "Arduino"

    def mangle(self, name):
        self.meta["setup"] = self.meta["setup"].replace("@@name@@", name)
        self.meta["loop"] = self.meta["loop"].replace("@@name@@", name)
        self.meta["interface"]["html"] = self.meta["interface"]["html"].replace("@@name@@", name)
        self.meta["interface"]["style"] = self.meta["interface"]["style"].replace("@@name@@", name)
        self.meta["interface"]["js"] = self.meta["interface"]["js"].replace("@@name@@", name)
        self.meta["interface"]["event"] = self.meta["interface"]["event"].replace("@@name@@", name)
        return Cpp.mangle(self, name)

    def append(self, newMeta, newPrefix):
        pNewLine = "" if not self.meta["setup"] else "\n"
        lNewLine = "" if not self.meta["loop"] else "\n"

        if newMeta["setup"]:
            if "Serial.begin" in newMeta["setup"] and "Serial.begin" in self.meta["setup"]:
                newMeta["setup"] = newMeta["setup"].replace("Serial.begin(115200)", "")
            self.meta["setup"] += pNewLine + newMeta["setup"]

        if newMeta["loop"]:
            self.meta["loop"] += lNewLine + newMeta["setup"]

        if newMeta["interface"]:
            hNewLine = "" if not self.meta["interface"]["html"] else "\n"
            sNewLine = "" if not self.meta["interface"]["style"] else "\n"
            jNewLine = "" if not self.meta["interface"]["js"] else "\n"
            eNewLine = "" if not self.meta["interface"]["event"] else "\n"

            self.meta["interface"]["html"] += hNewLine + newMeta["interface"]["html"]
            self.meta["interface"]["style"] += sNewLine + newMeta["interface"]["style"]
            self.meta["interface"]["js"] += jNewLine + newMeta["interface"]["js"]
            self.meta["interface"]["event"] += eNewLine + newMeta["interface"]["event"]

        return Cpp.append(self, newMeta, newPrefix)

    def getParameters(self):
        return list(set(self.getParamsFrom(self.meta["interface"]["html"])) |
                    set(self.getParamsFrom(self.meta["interface"]["style"])) |
                    set(self.getParamsFrom(self.meta["interface"]["js"])) |
                    set(self.getParamsFrom(self.meta["interface"]["event"])) |
                    set(self.getParamsFrom(self.meta["setup"])) | set(self.getParamsFrom(self.meta["loop"])) |
                    Cpp.getParameters(self))

    def subParameters(self, subs):
        # for inputToken, inputSub in self.meta["inputs"].iteritems():
        #    if token == inputToken:
        #        self.meta["inputs"][token] = pSub
        for (token, sub) in subs.iteritems():
            for outputToken, outputExpr in self.meta["outputs"].iteritems():
                self.meta["outputs"][outputToken] = outputExpr.replace(self.tokenize(token), sub)
            self.meta["code"] = self.meta["code"].replace(self.tokenize(token), sub)
            self.meta["setup"] = self.meta["setup"].replace(self.tokenize(token), sub)
            self.meta["loop"] = self.meta["loop"].replace(self.tokenize(token), sub)

            self.meta["interface"]["html"] = self.meta["interface"]["html"].replace(self.tokenize(token), sub)
            self.meta["interface"]["style"] = self.meta["interface"]["style"].replace(self.tokenize(token), sub)
            self.meta["interface"]["js"] = self.meta["interface"]["js"].replace(self.tokenize(token), sub)
            self.meta["interface"]["event"] = self.meta["interface"]["event"].replace(self.tokenize(token), sub)
        return self.meta

    def updateInterface(self):
        self.meta["declarations"] = "const char *ssid = \"NodeMCU\";\n" + \
                                    "const char *password = \"password\";\n" + \
                                    "ESP8266WebServer server(80);\n" + \
                                    "WebSocketsServer wsServer = WebSocketsServer(81);\n" + \
                                    "\n" + \
                                    "const char *html = \"<!DOCTYPE html>\"\n" + \
                                    "\"<html>\"\n" + \
                                    "\"<head>\"\n" + \
                                    "\"<meta charset=utf-8 />\"\n" + \
                                    "\"<meta name = \\\"viewport\\\" content = \\\"width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;\\\">\"\n" + \
                                    "\"<style>\"\n" + \
                                    "\"%s\"" % (self.meta["interface"]["style"].replace("\n", "\"\n\"    ").rstrip()) + \
                                    "\n" + \
                                    "\"</style>\"\n" + \
                                    "\"</head>\"\n" + \
                                    "\"<body>\"\n" + \
                                    "\"%s\"\n" %  (self.meta["interface"]["html"].replace("\n", "\"\n\"").rstrip()) + \
                                    "\"<script>\"\n" + \
                                    "\"%s\"\n" % (
                                    "    %s" % (self.meta["interface"]["js"].replace("\n", "\"\n\"    ").rstrip())) + \
                                    "\"    var connection = new WebSocket(\\\"ws://\\\"+location.hostname+\\\":81/\\\", [\\\"arduino\\\"]);\"\n" + \
                                    "\"\"\n" + \
                                    "\"    connection.onopen = function(){\"\n" + \
                                    "\"      console.log(\\\"Opened\\\");\"\n" + \
                                    "\"    };\"\n" + \
                                    "\"\"\n" + \
                                    "\"    connection.onerror = function(error){\"\n" + \
                                    "\"      console.log(error);\"\n" + \
                                    "\"    };\"\n" + \
                                    "\"\"\n" + \
                                    "\"    connection.onmessage = function(e){\"\n" + \
                                    "\"      console.log(e.data);\"\n" + \
                                    "\"    };\"\n" + \
                                    "\"\"\n" + \
                                    "\"    connection.onclose = function(e){\"\n" + \
                                    "\"      console.log(\\\"Closed\\\");\"\n" + \
                                    "\"    };\"\n" + \
                                    "\"</script>\"\n" + \
                                    "\"</body>\"\n" + \
                                    "\"</html>\";\n\n" + self.meta["declarations"]

        self.meta["code"] = "\nvoid handleRoot() {\n" + \
                            "    server.send(200, \"text/html\", html);" + \
                            "}\n" + \
                            "\n" + \
                            "void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t lenght) {\n" + \
                            "    switch(type){\n" + \
                            "        case WStype_DISCONNECTED:\n" + \
                            "            Serial.println(\"Disconnected!\");\n" + \
                            "            break;\n" + \
                            "        case WStype_CONNECTED:\n" + \
                            "        {\n" + \
                            "            IPAddress\n" + \
                            "            ip = wsServer.remoteIP(num);\n" + \
                            "            Serial.printf(\"[%u] Connected to %d.%d.%d.%d\", num, ip[0], ip[1], ip[2], ip[3], payload);\n" + \
                            "        }\n" + \
                            "            wsServer.sendTXT(num, \"Connected\");\n" + \
                            "            break;\n" + \
                            "        case WStype_TEXT:\n" + \
                            "            %s" % (self.meta["interface"]["event"].replace("\n", "\n            ")).rstrip() + \
                            "\n            break;\n" + \
                            "    }\n" + \
                            "}\n" + self.meta["code"]

        self.meta["setup"] = self.meta["setup"].replace("Serial.begin(115200)", "")
        self.meta["setup"] = "\n" + \
                             "    Serial.begin(115200);\n" + \
                             "    WiFi.softAP(ssid, password);\n" + \
                             "    IPAddress myIP = WiFi.softAPIP();\n" + \
                             "    Serial.println(myIP);\n" + \
                             "\n" + \
                             "    wsServer.begin();\n" + \
                             "    wsServer.onEvent(webSocketEvent);\n" + \
                             "    server.on(\"/\", handleRoot);\n" + \
                             "    server.begin();\n" + \
                             "    if(MDNS.begin(\"arduino\")){\n" + \
                             "       Serial.println(\"MDNS Responder Started\");\n" + \
                             "    }\n" + \
                             "\n" + \
                             "    MDNS.addService(\"http\", \"tcp\", 80);\n" + \
                             "    MDNS.addService(\"ws\", \"tcp\", 81);\n" + \
                             "\n" + self.meta["setup"]

        self.meta["outputs"]["server"] = "server.handleClient()"
        self.meta["outputs"]["wsServer"] = "wsServer.loop()"

    def writeHTML(self):
        pass

    def makeOutput(self, filedir, **kwargs):
        self.replaceAllInputs()
        if self.interface:
            self.updateInterface()

        if filedir[-1] == "/":
            filedir += "main"
        else:
            filedir += "/main"

        filename = "%s/main.ino" % filedir

        if not os.path.exists(filename):
            try:
                os.makedirs(os.path.dirname(filename))
            except OSError as exc:  # Guard against race condition
                if exc.errno != errno.EEXIST:
                    raise

        f = open(filename, "w")

        for include in self.meta["needs"]:
            f.write("#include <" + include + ">\n")

        f.write("\n\n")
        f.write(self.meta["declarations"])
        f.write("\n\n")
        # f.write(self.meta["code"])

        setup = "\nvoid setup()\n" + \
                "{\n" + \
                "    %s\n" % self.meta["setup"] + \
                "}\n"


        loop = "\nvoid loop()\n" + \
                "{\n" + \
                "    %s\n" % "".join([s + ";\n" for (k,s) in self.meta["outputs"].iteritems() if s]) + \
                "    %s\n" % self.meta["code"] + \
                "}\n"

        f.write(setup)
        f.write(loop)
        f.close()
