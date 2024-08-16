let workspace;
let currentElement = null;
let draggedElementId = null;

// Element categories and their associated HTML tags
const elementCategories = {
    'User Interface': ['Button', 'Label', 'TextBox', 'ListPicker', 'Checkbox', 'Switch', 'Slider', 'ProgressBar'],
    'Layout': ['HorizontalArrangement', 'VerticalArrangement', 'TableArrangement'],
    'Media': ['Image', 'VideoPlayer', 'AudioPlayer', 'Camera', 'ImagePicker'],
    'Drawing and Animation': ['Canvas', 'Ball', 'Sprite'],
    'Maps': ['Map', 'Marker', 'Circle'],
    'Charts': ['Chart', 'BarChart', 'LineChart', 'PieChart'],
    'Sensors': ['Accelerometer', 'LocationSensor', 'OrientationSensor'],
    'Extensions': ['CustomExtension']
};

// Função para carregar os scripts
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Função para inicializar a aplicação
async function initApp() {
    try {
        await loadScript('mocks/Button.js');
        await loadScript('mocks/Label.js');
        
        // Inicialize o resto da sua aplicação aqui
        initializeWorkspace();
        createElementPalette();
        setupEventListeners();
    } catch (error) {
        console.error('Erro ao carregar scripts:', error);
    }
}

function initializeWorkspace() {
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
}

function setupEventListeners() {
    document.getElementById('newProject').addEventListener('click', createNewProject);
    document.getElementById('saveProject').addEventListener('click', saveProject);
    document.getElementById('runProject').addEventListener('click', runProject);
    document.getElementById('toggleView').addEventListener('click', toggleView);
    document.getElementById('exportProject').addEventListener('click', exportProject);

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

    document.getElementById('aspectRatio').dispatchEvent(new Event('change'));
}

// Chame initApp quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initApp);

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
        appPreview.innerHTML = '';
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

    Sortable.create(palette, {
        group: 'shared',
        animation: 150
    });
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

    x = Math.max(0, Math.min(x, rect.width - 50));
    y = Math.max(0, Math.min(y, rect.height - 20));

    try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        
        if (data.isNew) {
            const newElement = createElementByType(data.type, x, y);
            if (newElement) {
                previewArea.appendChild(newElement);
            }
        } else {
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
        case 'Button':
            element = new Button(`button-${Date.now()}`);
                        console.log('Button created:', element); // Adicione este log
            break;
        case 'Label':
            element = new Label(`label-${Date.now()}`);
            console.log('Label created:', element); // Adicione este log
            break;
        default:
            element = document.createElement('div');
            element.textContent = type;
            element.style.padding = '5px';
            element.style.backgroundColor = '#f0f0f0';
            element.style.border = '1px solid #999';
            element.style.borderRadius = '3px';
    }

    const domElement = element.render ? element.render() : element;
    domElement.style.position = 'absolute';
    domElement.style.left = `${x}px`;
    domElement.style.top = `${y}px`;
    domElement.style.cursor = 'move';
    domElement.setAttribute('draggable', 'true');
    domElement.addEventListener('dragstart', (e) => {
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
    domElement.addEventListener('click', (e) => {
        e.stopPropagation();
        showProperties(element);
    });

    return domElement;
}


function showProperties(element) {
    let properties = [];

    // Verifique o tipo de elemento e adicione as propriedades específicas
    if (element instanceof Button) {
        properties = [
            { name: 'id', editable: false },
            { name: 'text', editable: true },
            { name: 'width', editable: true },
            { name: 'height', editable: true },
            { name: 'onClick', editable: true }
        ];
    } else if (element instanceof Label) {
        properties = [
            { name: 'id', editable: false },
            { name: 'text', editable: true },
            { name: 'width', editable: true },
            { name: 'height', editable: true },
        ];
    } else {
        properties = [
            { name: 'id', editable: false },
            { name: 'tagName', editable: false },
            { name: 'innerText', editable: true },
            { name: 'style.left', editable: true },
            { name: 'style.top', editable: true },
            { name: 'style.width', editable: true },
            { name: 'style.height', editable: true },
            { name: 'style.backgroundColor', editable: true },
            { name: 'style.color', editable: true },
            { name: 'style.fontSize', editable: true },
        ];
    }

    let propertiesHTML = '';
    properties.forEach(prop => {
        let value = prop.name.includes('style.') 
            ? element.style[prop.name.split('.')[1]] 
            : (element[prop.name] || '');
        
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

    document.querySelectorAll('.property-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const property = e.target.dataset.property;
            const value = e.target.value;
            if (property.includes('style.')) {
                const styleProp = property.split('.')[1];
                element.style[styleProp] = value;
            } else if (element[property] !== undefined) {
                if (property === 'text') {
                    element.setText(value);
                } else if (property === 'width' || property === 'height') {
                    element.setDimensions(parseFloat(value), property === 'width' ? element.height : element.width);
                } else {
                    element[property] = value;
                }
                if (element.render) {
                    element.render();
                }
            }
        });
    });
}

const modal = document.getElementById('propertiesModal');
const closeButton = document.querySelector('.close-button');

closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
