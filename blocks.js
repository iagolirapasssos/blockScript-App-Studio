Blockly.Blocks['button_set_text'] = {
    init: function() {
        this.appendValueInput("TEXT")
            .setCheck("String")
            .appendField("set Button text");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['button_on_click'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("when Button clicked");
        this.appendStatementInput("DO")
            .setCheck(null);
        this.setColour(290);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['label_set_text'] = {
    init: function() {
        this.appendValueInput("TEXT")
            .setCheck("String")
            .appendField("set Label text");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};
