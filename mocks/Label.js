class Label {
    constructor(id) {
        this.id = id;
        this.text = "Label";
        this.width = 100;
        this.height = 20;
    }

    setText(text) {
        this.text = text;
    }

    setDimensions(width, height) {
        this.width = width;
        this.height = height;
    }

    render() {
        const label = document.createElement('span');
        label.id = this.id;
        label.style.width = `${this.width}px`;
        label.style.height = `${this.height}px`;
        label.textContent = this.text;
        return label;
    }
}

