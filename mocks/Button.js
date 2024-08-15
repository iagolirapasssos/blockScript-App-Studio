class Button {
    constructor(id) {
        this.id = id;
        this.text = "Button";
        this.width = 100;
        this.height = 50;
        this.onClick = null;
    }

    setText(text) {
        this.text = text;
    }

    setDimensions(width, height) {
        this.width = width;
        this.height = height;
    }

    setOnClick(callback) {
        this.onClick = callback;
    }

    render() {
        const button = document.createElement('button');
        button.id = this.id;
        button.style.width = `${this.width}px`;
        button.style.height = `${this.height}px`;
        button.textContent = this.text;
        if (this.onClick) {
            button.addEventListener('click', this.onClick);
        }
        return button;
    }
}

