let workspace;
let currentElement = null;
let draggedElementId = null; // Track the currently dragged element

// Element categories and their associated HTML tags
const elementCategories = {
    'Layout': ['div', 'header', 'footer', 'nav', 'main', 'section', 'article', 'aside'],
    'Text': ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'label'],
    'Form': ['form', 'input', 'textarea', 'select', 'button', 'checkbox', 'radio'],
    'Table': ['table', 'thead', 'tbody', 'tr', 'th', 'td'],
    'List': ['ul', 'ol', 'li', 'dl', 'dt', 'dd'],
    'Media': ['img', 'video', 'audio', 'source', 'canvas', 'svg'],
    'Link': ['a', 'link'],
    'Semantic': ['article', 'aside', 'details', 'figcaption', 'figure', 'mark', 'summary', 'time']
};

document.addEventListener('DOMContentLoaded', function() {
    workspace = Blockly.inject('blocklyArea', {
        toolbox: document.getElementById('toolbox'),
        theme: Blockly.Themes.Dark,
        scrollbars: true,
        trashcan: true
    });
    
    workspace.addChangeListener(() => {
        try {
            const code = Blockly.JavaScript.workspaceToCode(workspace);
            document.getElementById('generatedCode').innerText = code;
        } catch (error) {
            console.error('Error generating code:', error);
        }
    });

    document.getElementById('newProject').addEventListener('click', createNewProject);
    document.getElementById('saveProject').addEventListener('click', saveProject);
    document.getElementById('runProject').addEventListener('click', runProject);
    document.getElementById('toggleView').addEventListener('click', toggleView);
    document.getElementById('exportProject').addEventListener('click', exportProject);

    createElementPalette();

    Sortable.create(document.getElementById('elementPalette'), {
        group: 'shared',
        animation: 150
    });

    // Aspect ratio change listener
    document.getElementById('aspectRatio').addEventListener('change', (event) => {
        const appPreview = document.getElementById('appPreview');
        const aspectRatio = event.target.value;
        if (aspectRatio === '9:16') {
            appPreview.style.width = '360px';
            appPreview.style.height = '640px';
        } else if (aspectRatio === '16:9') {
            appPreview.style.width = '640px';
            appPreview.style.height = '360px';
        }
    });

    // Initial aspect ratio setup
    document.getElementById('aspectRatio').dispatchEvent(new Event('change'));
});

function createNewProject() {
    if (confirm('Are you sure you want to create a new project? Unsaved changes will be lost.')) {
        workspace.clear();
        document.getElementById('appPreview').innerHTML = '';
    }
}

function saveProject() {
    try {
        const project = Blockly.Xml.workspaceToDom(workspace);
        const xml = Blockly.Xml.domToText(project);
        localStorage.setItem('savedProject', xml);
        alert('Project saved!');
    } catch (error) {
        console.error('Error saving project:', error);
    }
}

function runProject() {
    try {
        const code = Blockly.JavaScript.workspaceToCode(workspace);
        const appPreview = document.getElementById('appPreview');
        appPreview.innerHTML = ''; // Clear previous content
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.text = code;
        appPreview.appendChild(script);
    } catch (error) {
        console.error('Error running project:', error);
    }
}

function toggleView() {
    const previewArea = document.getElementById('previewArea');
    previewArea.style.display = previewArea.style.display === 'none' ? 'block' : 'none';
}

function exportProject() {
    try {
        const project = Blockly.Xml.workspaceToDom(workspace);
        const xml = Blockly.Xml.domToText(project);
        const blob = new Blob([xml], { type: 'text/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'project.xml';
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting project:', error);
    }
}

function createElementPalette() {
    const palette = document.getElementById('elementPalette');
    for (const [category, elements] of Object.entries(elementCategories)) {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('elementCategory');
        const categoryTitle = document.createElement('div');
        categoryTitle.classList.add('categoryTitle');
        categoryTitle.textContent = category;
        categoryDiv.appendChild(categoryTitle);

        elements.forEach(element => {
            const elementDiv = document.createElement('div');
            elementDiv.classList.add('element');
            elementDiv.id = `element-${element}`;
            elementDiv.dataset.type = element;
            elementDiv.textContent = element;
            elementDiv.setAttribute('draggable', 'true');
            elementDiv.addEventListener('dragstart', handleDragStart);
            categoryDiv.appendChild(elementDiv);
        });

        palette.appendChild(categoryDiv);
    }
}

function handleDragStart(e) {
    e.dataTransfer.setData('application/json', JSON.stringify({
        type: e.target.dataset.type,
        isNew: true
    }));
    e.dataTransfer.effectAllowed = 'copy';
}

const previewArea = document.getElementById('previewArea');

previewArea.addEventListener('dragover', (e) => {
    e.preventDefault();
});

previewArea.addEventListener('drop', (e) => {
    e.preventDefault();
    const rect = previewArea.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Garante que o elemento fique dentro do previewArea
    x = Math.max(0, Math.min(x, rect.width - 50));  // 50 é uma largura mínima assumida
    y = Math.max(0, Math.min(y, rect.height - 20)); // 20 é uma altura mínima assumida

    try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        
        if (data.isNew) {
            // Criar novo elemento
            const newElement = createElementByType(data.type, x, y);
            newElement.id = `element-${Date.now()}`;  // Gera um ID único
            previewArea.appendChild(newElement);
        } else {
            // Mover elemento existente
            const element = document.getElementById(data.id);
            if (element) {
                element.style.left = `${x}px`;
                element.style.top = `${y}px`;
            }
        }
    } catch (error) {
        console.error('Erro ao processar o elemento arrastado:', error);
    }
});

function createElementByType(type, x, y) {
    let element;
    switch (type) {
        case 'button':
            element = document.createElement('button');
            element.textContent = 'Button';
            element.style.padding = '5px 10px';
            break;
        case 'input':
            element = document.createElement('input');
            element.type = 'text';
            element.placeholder = 'Enter text';
            element.style.padding = '5px';
            break;
        case 'p':
            element = document.createElement('p');
            element.textContent = 'Paragraph text';
            break;
        case 'h1':
            element = document.createElement('h1');
            element.textContent = 'Heading 1';
            break;
        default:
            element = document.createElement('div');
            element.textContent = type;
            element.style.padding = '5px';
    }

    element.classList.add('draggableElement');
    element.style.position = 'absolute';
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    element.style.backgroundColor = '#f0f0f0';
    element.style.border = '1px solid #999';
    element.style.borderRadius = '3px';
    element.style.cursor = 'move';
    element.style.minWidth = '50px';
    element.style.minHeight = '20px';

    element.setAttribute('draggable', 'true');
    element.addEventListener('dragstart', (e) => {
        const rect = e.target.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        e.dataTransfer.setData('application/json', JSON.stringify({
            id: e.target.id,
            offsetX,
            offsetY,
            isNew: false
        }));
    });

    element.addEventListener('click', (e) => {
        e.stopPropagation();
        showProperties(element);
    });

    return element;
}

const modal = document.getElementById('propertiesModal');
const closeButton = document.querySelector('.close-button');
const propertiesDiv = document.getElementById('properties');

function showProperties(element) {
    const properties = [
        { name: 'id', editable: false },
        { name: 'tagName', editable: false },
        { name: 'innerText', editable: true },
        { name: 'left', editable: true },
        { name: 'top', editable: true },
        { name: 'width', editable: true },
        { name: 'height', editable: true },
        { name: 'backgroundColor', editable: true },
        { name: 'color', editable: true },
        { name: 'fontSize', editable: true },
    ];

    let propertiesHTML = '';
    properties.forEach(prop => {
        let value = prop.name === 'tagName' ? element.tagName.toLowerCase() : 
                    (element.style[prop.name] || element[prop.name] || '');
        
        propertiesHTML += `
            <div class="property-row">
                <span class="property-label">${prop.name}:</span>
                ${prop.editable ? 
                    `<input type="text" class="property-input" data-property="${prop.name}" value="${value}">` :
                    `<span>${value}</span>`}
            </div>
        `;
    });

    document.getElementById('properties').innerHTML = propertiesHTML;
    document.getElementById('propertiesModal').style.display = 'block';

    // Add event listeners to inputs
    document.querySelectorAll('.property-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const property = e.target.dataset.property;
            const value = e.target.value;
            if (property === 'innerText') {
                element.innerText = value;
            } else {
                element.style[property] = value;
            }
        });
    });
}

window.onclick = function(event) {
    const modal = document.getElementById('propertiesModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
