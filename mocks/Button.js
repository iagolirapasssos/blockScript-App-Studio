(function() {
    class Button {
        constructor(id) {
            this.id = id;
            this.text = "Button";
            this.width = 100;
            this.height = 50;
            this.fontSize = 16;
            this.backgroundColor = "#007bff";
            this.textColor = "#ffffff";
            this.onClick = null;
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

        setBackgroundColor(color) {
            this.backgroundColor = color;
            if (this.element) {
                this.element.style.backgroundColor = color;
            }
        }

        setTextColor(color) {
            this.textColor = color;
            if (this.element) {
                this.element.style.color = color;
            }
        }

        setOnClick(callback) {
            this.onClick = callback;
            if (this.element) {
                this.element.onclick = callback;
            }
        }

        render() {
            if (!this.element) {
                this.element = document.createElement('button');
                this.element.id = this.id;
                this.element.textContent = this.text;
                this.element.style.width = `${this.width}px`;
                this.element.style.height = `${this.height}px`;
                this.element.style.fontSize = `${this.fontSize}px`;
                this.element.style.backgroundColor = this.backgroundColor;
                this.element.style.color = this.textColor;
                if (this.onClick) {
                    this.element.onclick = this.onClick;
                }
            }
            return this.element;
        }
    }

    window.Button = Button;
})();

