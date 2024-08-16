(function() {
    class Label {
        constructor(id) {
            this.id = id;
            this.text = "Label";
            this.width = 100;
            this.height = 20;
            this.fontSize = 14;
            this.textColor = "#000000";
            this.element = null;
        }

        setText(text) {
            this.text = text;
            if (this.element) {
                this.element.textContent = text;
            }
        }

        setDimensions(width, height) {
            this.width = width;
            this.height = height;
            if (this.element) {
                this.element.style.width = `${width}px`;
                this.element.style.height = `${height}px`;
            }
        }

        setFontSize(fontSize) {
            this.fontSize = fontSize;
            if (this.element) {
                this.element.style.fontSize = `${fontSize}px`;
            }
        }

        setTextColor(color) {
            this.textColor = color;
            if (this.element) {
                this.element.style.color = color;
            }
        }

        render() {
            if (!this.element) {
                this.element = document.createElement('div');
                this.element.id = this.id;
                this.element.textContent = this.text;
                this.element.style.width = `${this.width}px`;
                this.element.style.height = `${this.height}px`;
                this.element.style.fontSize = `${this.fontSize}px`;
                this.element.style.color = this.textColor;
                this.element.style.display = 'inline-block';
                this.element.style.border = '1px solid black';
            }
            return this.element;
        }
    }

    window.Label = Label;
})();

