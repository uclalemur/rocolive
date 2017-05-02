
void rgb_ledComponent_rgb_driver(int red, int green, int blue);
void %s(int red, int green, int blue){
    analogWrite(<<rPinComponent_rgb_driver>>, red);
    analogWrite(<<gPinComponent_rgb_driver>>, green);
    analogWrite(<<bPinComponent_rgb_driver>>, blue);
}



void setup()
{
    
pinMode(<<rPinComponent_rgb_driver>>, OUTPUT);
pinMode(<<gPinComponent_rgb_driver>>, OUTPUT);
pinMode(<<bPinComponent_rgb_driver>>, OUTPUT);
}


void loop()
{
   rgb_ledComponent_rgb_driver(<<red>>, <<green>>, <<blue>>)
;
}

