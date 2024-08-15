let workspace;
let currentElement = null;
let draggedElementId = null; // Track the currently dragged element

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
        case 'Button':
            element = document.createElement('button');
            element.textContent = 'Button';
            element.style.padding = '5px 10px';
            break;
        case 'Label':
            element = document.createElement('span');
            element.textContent = 'Label';
            break;
        case 'TextBox':
            element = document.createElement('input');
            element.type = 'text';
            element.placeholder = 'Enter text';
            element.style.padding = '5px';
            break;
        case 'ListPicker':
            element = document.createElement('select');
            element.innerHTML = '<option>Item 1</option><option>Item 2</option>';
            element.style.padding = '5px';
            break;
        case 'Checkbox':
            element = document.createElement('input');
            element.type = 'checkbox';
            break;
        case 'Switch':
            element = document.createElement('input');
            element.type = 'checkbox';
            element.classList.add('switch');
            break;
        case 'Slider':
            element = document.createElement('input');
            element.type = 'range';
            break;
        case 'ProgressBar':
            element = document.createElement('progress');
            element.value = 50;
            element.max = 100;
            break;
        case 'HorizontalArrangement':
        case 'VerticalArrangement':
        case 'TableArrangement':
            element = document.createElement('div');
            element.textContent = type;
            element.style.padding = '5px';
            element.style.display = 'flex';
            if (type === 'HorizontalArrangement') {
                element.style.flexDirection = 'row';
            } else if (type === 'VerticalArrangement') {
                element.style.flexDirection = 'column';
            }
            break;
        case 'Image':
            element = document.createElement('img');
            element.src = 'https://via.placeholder.com/150';
            element.alt = 'Image';
            break;
        case 'VideoPlayer':
            element = document.createElement('video');
            element.controls = true;
            element.innerHTML = '<source src="video.mp4" type="video/mp4">Your browser does not support the video tag.';
            break;
        case 'AudioPlayer':
            element = document.createElement('audio');
            element.controls = true;
            element.innerHTML = '<source src="audio.mp3" type="audio/mp3">Your browser does not support the audio element.';
            break;
        case 'Camera':
            element = document.createElement('div');
            element.textContent = 'Camera (Placeholder)';
            element.style.padding = '10px';
            element.style.border = '1px solid #000';
            element.style.backgroundColor = '#666';
            break;
        case 'ImagePicker':
            element = document.createElement('input');
            element.type = 'file';
            element.accept = 'image/*';
            break;
        case 'Canvas':
            element = document.createElement('canvas');
            element.width = 150;
            element.height = 150;
            element.style.border = '1px solid #000';
            break;
        case 'Ball':
        case 'Sprite':
            element = document.createElement('div');
            element.textContent = type;
            element.style.width = '50px';
            element.style.height = '50px';
            element.style.backgroundColor = '#f00';
            element.style.borderRadius = '50%';
            break;
        case 'Map':
            element = document.createElement('div');
            element.textContent = 'Map (Placeholder)';
            element.style.width = '100%';
            element.style.height = '200px';
            element.style.backgroundColor = '#ccc';
            break;
        case 'Marker':
            element = document.createElement('div');
            element.textContent = 'Marker';
            element.style.width = '20px';
            element.style.height = '20px';
            element.style.backgroundColor = '#f00';
            break;
        case 'Circle':
            element = document.createElement('div');
            element.textContent = 'Circle';
            element.style.width = '100px';
            element.style.height = '100px';
            element.style.borderRadius = '50%';
            element.style.border = '1px solid #000';
            break;
        case 'Chart':
        case 'BarChart':
        case 'LineChart':
        case 'PieChart':
            element = document.createElement('div');
            element.textContent = type;
            element.style.width = '200px';
            element.style.height = '150px';
            element.style.backgroundColor = '#eee';
            break;
        case 'Accelerometer':
        case 'LocationSensor':
        case 'OrientationSensor':
            element = document.createElement('div');
            element.textContent = type;
            element.style.padding = '10px';
            element.style.backgroundColor = '#999';
            break;
        case 'CustomExtension':
            element = document.createElement('div');
            element.textContent = 'Custom Extension';
            element.style.padding = '10px';
            element.style.backgroundColor = '#ffcc00';
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
