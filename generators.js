// Generate JavaScript code to get an HTML element by its ID
Blockly.JavaScript['app_get_element_by_id'] = function(block) {
    var id = block.getFieldValue('ID');
    var code = `document.getElementById('${id}')`;
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

// Generate JavaScript code to set a property of an HTML element
Blockly.JavaScript['app_set_element_property'] = function(block) {
    var element = Blockly.JavaScript.valueToCode(block, 'ELEMENT', Blockly.JavaScript.ORDER_ATOMIC);
    var property = block.getFieldValue('PROPERTY');
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
    return `${element}.${property} = ${value};\n`;
};

// Generate JavaScript code to add an event listener to an HTML element
Blockly.JavaScript['app_add_event_listener'] = function(block) {
    var element = Blockly.JavaScript.valueToCode(block, 'ELEMENT', Blockly.JavaScript.ORDER_ATOMIC);
    var event = block.getFieldValue('EVENT');
    var statements = Blockly.JavaScript.statementToCode(block, 'DO');
    return `${element}.addEventListener('${event}', function(event) {\n${statements}});\n`;
};

// Generate JavaScript code to move an HTML element up or down within its parent container
Blockly.JavaScript['app_move_element'] = function(block) {
    var element = Blockly.JavaScript.valueToCode(block, 'ELEMENT', Blockly.JavaScript.ORDER_ATOMIC);
    var direction = block.getFieldValue('DIRECTION');
    var code = `
    (function() {
        var el = ${element};
        var parent = el.parentNode;
        if (parent) {
            if ('${direction}' === 'up' && el.previousElementSibling) {
                parent.insertBefore(el, el.previousElementSibling);
            } else if ('${direction}' === 'down' && el.nextElementSibling) {
                parent.insertBefore(el.nextElementSibling, el);
            }
        }
    })();\n`;
    return code;
};

