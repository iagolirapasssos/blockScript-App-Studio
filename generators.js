Blockly.JavaScript['button_set_text'] = function(block) {
    var value_text = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC);
    var code = 'document.getElementById("your-button-id").setText(' + value_text + ');\n';
    return code;
};

Blockly.JavaScript['button_on_click'] = function(block) {
    var statements_do = Blockly.JavaScript.statementToCode(block, 'DO');
    var code = 'document.getElementById("your-button-id").setOnClick(function() {\n' + statements_do + '\n});\n';
    return code;
};

Blockly.JavaScript['label_set_text'] = function(block) {
    var value_text = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC);
    var code = 'document.getElementById("your-label-id").setText(' + value_text + ');\n';
    return code;
};

