Blockly.defineBlocksWithJsonArray([
    {
        "type": "game_init",
        "message0": "Initialize Game",
        "nextStatement": null,
        "colour": 230,
        "tooltip": "Initialize the game environment",
        "helpUrl": ""
    },
    {
        "type": "game_loop",
        "message0": "Game Loop",
        "nextStatement": null,
        "previousStatement": null,
        "colour": 230,
        "tooltip": "Main game loop",
        "helpUrl": ""
    },
    {
        "type": "create_sprite",
        "message0": "Create Sprite %1",
        "args0": [
            {
                "type": "field_input",
                "name": "SPRITE_NAME",
                "text": "sprite1"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Create a new sprite",
        "helpUrl": ""
    },
    {
        "type": "move_sprite",
        "message0": "Move Sprite %1 by X %2 Y %3",
        "args0": [
            {
                "type": "field_input",
                "name": "SPRITE_NAME",
                "text": "sprite1"
            },
            {
                "type": "field_number",
                "name": "MOVE_X",
                "value": 0
            },
            {
                "type": "field_number",
                "name": "MOVE_Y",
                "value": 0
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Move a sprite by a specified amount",
        "helpUrl": ""
    },
    {
        "type": "remove_sprite",
        "message0": "Remove Sprite %1",
        "args0": [
            {
                "type": "field_input",
                "name": "SPRITE_NAME",
                "text": "sprite1"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Remove an existing sprite",
        "helpUrl": ""
    },
    {
        "type": "change_sprite_property",
        "message0": "Set Sprite %1 property %2 to %3",
        "args0": [
            {
                "type": "field_input",
                "name": "SPRITE_NAME",
                "text": "sprite1"
            },
            {
                "type": "field_input",
                "name": "PROPERTY",
                "text": "property"
            },
            {
                "type": "field_input",
                "name": "VALUE",
                "text": "value"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Change a property of a sprite",
        "helpUrl": ""
    }
]);

