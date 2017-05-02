/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://code.google.com/p/blockly/
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
 * @fileoverview Helper functions for generating C for blocks.
 * @author gasolin@gmail.com (Fred Lin)
 */
'use strict';

goog.provide('Blockly.C');

goog.require('Blockly.Generator');


/**
 * C code generator.
 * @type !Blockly.Generator
 */
Blockly.C = new Blockly.Generator('C');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
 Blockly.C.addReservedWords(
     // https://www.gnu.org/software/gnu-c-manual/gnu-c-manual.html#Keywords
     // ANSI C89
     'auto,break,case,char,const,continue,default,do,double,else,enum,extern,float,for,goto,if,int,long,register,return,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile,while,' +
     // ISO C99
     'inline,_Bool,_Complex,_Imaginary,' +
     // GNU Extensions
     '__FUNCTION__,__PRETTY_FUNCTION__,__alignof,__alignof__,__asm,__asm__,__attribute,__attribute__,__builtin_offsetof,__builtin_va_arg,__complex,__complex__,__const,__extension__,__func__,__imag,__imag__,__inline,__inline__,__label__,__null,__real,__real__,__restrict,__restrict__,__signed,__signed__,__thread,__typeof,__volatile,__volatile__'
 );


/**
 * Order of operation ENUMs.
 *
 */
Blockly.C.ORDER_ATOMIC = 0; // 0 "" ...
Blockly.C.ORDER_UNARY_POSTFIX = 1; // expr++ expr-- () [] . -> {}
Blockly.C.ORDER_UNARY_PREFIX = 2; // -expr !expr ~expr ++expr --expr (type) *pointer &variable
Blockly.C.ORDER_MULTIPLICATIVE = 3; // * / %
Blockly.C.ORDER_ADDITIVE = 4; // + -
Blockly.C.ORDER_SHIFT = 5; // << >>
Blockly.C.ORDER_RELATIONAL = 6; // is is! >= > <= <
Blockly.C.ORDER_EQUALITY = 7; // == != 
Blockly.C.ORDER_BITWISE_AND = 8; // &
Blockly.C.ORDER_BITWISE_XOR = 9; // ^
Blockly.C.ORDER_BITWISE_OR = 10; // |
Blockly.C.ORDER_LOGICAL_AND = 11; // &&
Blockly.C.ORDER_LOGICAL_OR = 12; // ||
Blockly.C.ORDER_CONDITIONAL = 13; // expr ? expr : expr
Blockly.C.ORDER_ASSIGNMENT = 14; // = *= /= ~/= %= += -= <<= >>= &= ^= |=
Blockly.C.ORDER_NONE = 99; // (...)

/*
 * Arduino Board profiles
 *
 *
var profile = {
    arduino: {
        description: "Arduino standard-compatible board",
        digital: [
            ["1", "1"],
            ["2", "2"],
            ["3", "3"],
            ["4", "4"],
            ["5", "5"],
            ["6", "6"],
            ["7", "7"],
            ["8", "8"],
            ["9", "9"],
            ["10", "10"],
            ["11", "11"],
            ["12", "12"],
            ["13", "13"],
            ["A0", "A0"],
            ["A1", "A1"],
            ["A2", "A2"],
            ["A3", "A3"],
            ["A4", "A4"],
            ["A5", "A5"]
        ],
        analog: [
            ["A0", "A0"],
            ["A1", "A1"],
            ["A2", "A2"],
            ["A3", "A3"],
            ["A4", "A4"],
            ["A5", "A5"]
        ],
        serial: 9600
    },
    arduino_mega: {
        description: "Arduino Mega-compatible board"
            //53 digital
            //15 analog
    }
};
//set default profile to arduino standard-compatible board
profile["default"] = profile["arduino"];
//alert(profile.default.digital[0]); */

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.C.init = function(workspace) {
    // Create a dictionary of definitions to be printed before setups.
    Blockly.C.definitions_ = Object.create(null);
    // Create a dictionary of setups to be printed before the code.
    Blockly.C.setups_ = Object.create(null);

    if (!Blockly.C.variableDB_) {
        Blockly.C.variableDB_ =
            new Blockly.Names(Blockly.C.RESERVED_WORDS_);
    } else {
        Blockly.C.variableDB_.reset();
    }

    var defvars = [];
    var variables = Blockly.Variables.allVariables(workspace);
    for (var x = 0; x < variables.length; x++) {
        defvars[x] = 'int ' +
            Blockly.C.variableDB_.getName(variables[x],
                Blockly.Variables.NAME_TYPE) + ';\n';
    }
    Blockly.C.definitions_['variables'] = defvars.join('\n');
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.C.finish = function(code) {
    // Indent every line.
    code = '  ' + code.replace(/\n/g, '\n  ');
    code = code.replace(/\n\s+$/, '\n');
    code = 'void loop() \n{\n' + code + '\n}';

    // Convert the definitions dictionary into a list.
    var imports = [];
    var definitions = [];
    for (var name in Blockly.C.definitions_) {
        var def = Blockly.C.definitions_[name];
        if (def.match(/^#include/)) {
            imports.push(def);
        } else {
            definitions.push(def);
        }
    }

    // Convert the setups dictionary into a list.
    var setups = [];
    for (var name in Blockly.C.setups_) {
        setups.push(Blockly.C.setups_[name]);
    }

    var allDefs = imports.join('\n') + '\n\n' + definitions.join('\n') + '\nvoid setup() \n{\n  ' + setups.join('\n  ') + '\n}' + '\n\n';
    return allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n\n\n') + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.C.scrubNakedValue = function(line) {
    return line + ';\n';
};

/**
 * Encode a string as a properly escaped C string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} C string.
 * @private
 */
Blockly.C.quote_ = function(string) {
    // TODO: This is a quick hack.  Replace with goog.string.quote
    string = string.replace(/\\/g, '\\\\')
        .replace(/\n/g, '\\\n')
        .replace(/\$/g, '\\$')
        .replace(/'/g, '\\\'');
    return '\"' + string + '\"';
};

/**
 * Common tasks for generating C from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The C code created for this block.
 * @return {string} C code with comments and subsequent blocks added.
 * @private
 */
Blockly.C.scrub_ = function(block, code) {
    if (code === null) {
        // Block has handled code generation itself.
        return '';
    }
    var commentCode = '';
    // Only collect comments for blocks that aren't inline.
    if (!block.outputConnection || !block.outputConnection.targetConnection) {
        // Collect comment for this block.
        var comment = block.getCommentText();
        if (comment) {
            commentCode += Blockly.C.prefixLines(comment, '// ') + '\n';
        }
        // Collect comments for all value arguments.
        // Don't collect comments for nested statements.
        for (var x = 0; x < block.inputList.length; x++) {
            if (block.inputList[x].type == Blockly.INPUT_VALUE) {
                var childBlock = block.inputList[x].connection.targetBlock();
                if (childBlock) {
                    var comment = Blockly.C.allNestedComments(childBlock);
                    if (comment) {
                        commentCode += Blockly.C.prefixLines(comment, '// ');
                    }
                }
            }
        }
    }
    var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    var nextCode = Blockly.C.blockToCode(nextBlock);
    return commentCode + code + nextCode;
};
