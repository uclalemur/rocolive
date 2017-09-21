/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating C for colour blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.C.colour');

goog.require('Blockly.C');


Blockly.C['colour_picker'] = function(block) {
    // Colour picker.
    var colorString = block.getFieldValue('COLOUR')
    var r = parseInt(colorString.substring(1, 3), 16)
    var g = parseInt(colorString.substring(3, 5), 16)
    var b = parseInt(colorString.substring(5, 7), 16)
    var code = '{' + r + ", " + g + ", " + b + '}';
    return [code, Blockly.C.ORDER_UNARY_POSTFIX];
};

Blockly.C['colour_random'] = function(block) {
    // Generate a random colour.
    //needs stdlib.h, time.h
    var functionName = Blockly.C.provideFunction_(
        'colourRandom', ['int* ' + Blockly.C.FUNCTION_NAME_PLACEHOLDER_ + '() {',
            '  srand(time(NULL));',
            '  int[] color = {rand() % 256, rand() % 256, rand() % 256};',
            '  return color;',
            '}'
        ]);
    var code = functionName + '()';
    return [code, Blockly.C.ORDER_UNARY_POSTFIX];
};

Blockly.C['colour_rgb'] = function(block) {
    // Compose a colour from RGB components expressed as percentages.
    var red = Blockly.C.valueToCode(block, 'RED',
        Blockly.C.ORDER_COMMA) || 0;
    var green = Blockly.C.valueToCode(block, 'GREEN',
        Blockly.C.ORDER_COMMA) || 0;
    var blue = Blockly.C.valueToCode(block, 'BLUE',
        Blockly.C.ORDER_COMMA) || 0;
    var functionName = Blockly.C.provideFunction_(
        'colourRgb', ['int* ' + Blockly.C.FUNCTION_NAME_PLACEHOLDER_ +
            '(int r, int g, int b) {',
            '  r = ((r > 100 ? 100 : r) > 0 ? r : 0)*2.55; ',
            '  g = ((g > 100 ? 100 : g) > 0 ? g : 0)*2.55; ',
            '  b = ((b > 100 ? 100 : b) > 0 ? b : 0)*2.55; ',
            '  int color[] = {r, g, b};',
            '  return color;',
            '}'
        ]);
    var code = functionName + '(' + red + ', ' + green + ', ' + blue + ')';
    return [code, Blockly.C.ORDER_UNARY_POSTFIX];
};

Blockly.C['colour_blend'] = function(block) {
    // Blend two colours together.
    var c1 = Blockly.C.valueToCode(block, 'COLOUR1',
        Blockly.C.ORDER_COMMA) || '\'#000000\'';
    var c2 = Blockly.C.valueToCode(block, 'COLOUR2',
        Blockly.C.ORDER_COMMA) || '\'#000000\'';
    var ratio = Blockly.C.valueToCode(block, 'RATIO',
        Blockly.C.ORDER_COMMA) || 0.5;
    var functionName = Blockly.C.provideFunction_(
        'colourBlend', ['int* ' + Blockly.C.FUNCTION_NAME_PLACEHOLDER_ +
            '(int c1[], int c2[], double ratio) {',
            '  ratio = (ratio > 1 ? 1 : ratio) > 0 ? ratio : 0;',
            '  int r1 = c1[0];',
            '  int g1 = c1[1];',
            '  int b1 = c1[2];',
            '  int r2 = c2[0];',
            '  int g2 = c2[1];',
            '  int b2 = c2[2];',
            '  int r = r1 * (1 - ratio) + r2 * ratio;',
            '  int g = g1 * (1 - ratio) + g2 * ratio;',
            '  int b = b1 * (1 - ratio) + b2 * ratio;',
            '  int color[] = {r, g, b};',
            '  return color;',
            '}'
        ]);
    var r1 = parseInt(c1.substring(1, 3), 16)
    var g1 = parseInt(c1.substring(3, 5), 16)
    var b1 = parseInt(c1.substring(5, 7), 16)
    var r2 = parseInt(c2.substring(1, 3), 16)
    var g2 = parseInt(c2.substring(3, 5), 16)
    var b2 = parseInt(c2.substring(5, 7), 16)


    //will not work, need to fix
    var code = "int c1[] = {" + r1 + ", " + g1 + ", " + b1 + '};\n'
              +"int c2[] = {" + r2 + ", " + g2 + ", " + b2 + '};\n'
              +functionName + '(' + c1 + ', ' + c2 + ', ' + ratio + ')';
    return [code, Blockly.C.ORDER_UNARY_POSTFIX];
};
