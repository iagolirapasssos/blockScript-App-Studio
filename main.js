let workspace;
let currentElement = null;

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
     // Initialize Blockly with dark theme and set up the workspace
    workspace = Blockly.inject('blocklyArea', {
        toolbox: document.getElementById('toolbox'),
        theme: Blockly.Themes.Dark,
    });

    // Ensure workspace is initialized before adding listener
    if (workspace) {
        workspace.addChangeListener(updateCode);
    } else {
        console.error('Blockly workspace failed to initialize.');
    }

    // Set up event listeners for UI buttons and dropdowns
    document.getElementById('newProject').addEventListener('click', newProject);
    document.getElementById('saveProject').addEventListener('click', saveProject);
    document.getElementById('runProject').addEventListener('click', runProject);
    document.getElementById('toggleView').addEventListener('click', toggleView);
    document.getElementById('aspectRatio').addEventListener('change', changeAspectRatio);
    document.getElementById('exportProject').addEventListener('click', exportProject);

    // Populate the element palette with categories and elements
    const palette = document.getElementById('elementPalette');
    for (const category in elementCategories) {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('element-category');
        categoryDiv.innerHTML = `<h3>${category}</h3>`;
        const elementList = document.createElement('ul');
        elementList.classList.add('sortable-list'); // Added class
        elementCategories[category].forEach(tag => {
            const li = document.createElement('li');
            li.textContent = tag;
            li.setAttribute('draggable', true);
            li.addEventListener('click', () => addElementToApp(tag));
            elementList.appendChild(li);
        });
        categoryDiv.appendChild(elementList);
        palette.appendChild(categoryDiv);

        // Make the element list sortable
        new Sortable(elementList, {
            animation: 150,
            onEnd: function(evt) {
                const newOrder = [];
                evt.from.querySelectorAll('li').forEach(li => newOrder.push(li.textContent));
                elementCategories[category] = newOrder;
            }
        });
    }
});

// Function to add an HTML element to the app preview area
// Function to add an HTML element to the app preview area with real functionality
function addElementToApp(tag) {
    const el = document.createElement(tag);
    el.id = 'element-' + Date.now(); // Define um ID único
	
    console.log("tag: ", tag);
    if (tag === 'button') {
        el.textContent = 'Click me';
        el.addEventListener('click', () => alert('Button clicked!'));
    } else if (tag === 'input') {
        el.type = 'text';
        el.placeholder = 'Enter text';
    } else {
        el.textContent = tag;
    }

    document.getElementById('appPreview').appendChild(el);

    // Adiciona evento de clique para exibir propriedades
    el.addEventListener('click', function() {
        showProperties(el);
    });
}


// Function to select an element within the app preview area
function selectElement(el) {
    if (currentElement) {
        currentElement.classList.remove('selected');
    }
    currentElement = el;
    currentElement.classList.add('selected');
}

// Function to update the generated JavaScript code based on the Blockly workspace
function updateCode() {
    const code = Blockly.JavaScript.workspaceToCode(workspace);
    document.getElementById('generatedCode').textContent = code;
}

// Function to create a new project
function newProject() {
    workspace.clear();
    document.getElementById('appPreview').innerHTML = '';
    document.getElementById('generatedCode').textContent = '';
}

// Function to save the current project
function saveProject() {
    const xml = Blockly.Xml.workspaceToDom(workspace);
    const xmlText = Blockly.Xml.domToPrettyText(xml);
    const blob = new Blob([xmlText], {type: 'text/xml'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'blockscript_project.xml';
    a.click();
}

// Function to run the generated JavaScript code
function runProject() {
    const code = document.getElementById('generatedCode').textContent;
    eval(code);
}

// Function to toggle the view between the block editor and the code preview
function toggleView() {
    const blocklyArea = document.getElementById('blocklyArea');
    const codeArea = document.getElementById('codeArea');
    if (blocklyArea.style.display === 'none') {
        blocklyArea.style.display = 'block';
        codeArea.style.display = 'none';
    } else {
        blocklyArea.style.display = 'none';
        codeArea.style.display = 'block';
    }
}

// Function to change the aspect ratio of the app preview area
function changeAspectRatio() {
    const aspectRatio = document.getElementById('aspectRatio').value;
    const appContainer = document.getElementById('appContainer');
    if (aspectRatio === '9:16') {
        appContainer.style.width = '360px';
        appContainer.style.height = '640px';
    } else if (aspectRatio === '16:9') {
        appContainer.style.width = '640px';
        appContainer.style.height = '360px';
    }
}

// Function to export the project to HTML5
function exportProject() {
    const appHTML = document.getElementById('appPreview').innerHTML;
    const blob = new Blob([appHTML], {type: 'text/html'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'blockscript_app.html';
    a.click();
}

let currentElement = null;

// Função para exibir a janela de propriedades
function showProperties(element) {
    const propertiesModal = document.getElementById('propertiesModal');
    const propertiesContent = document.getElementById('propertiesContent');
    propertiesContent.innerHTML = ''; // Limpa o conteúdo anterior

    // Adiciona as propriedades do elemento selecionado
    const elementType = document.createElement('p');
    elementType.textContent = `Type: ${element.tagName}`;
    propertiesContent.appendChild(elementType);

    // Propriedades comuns
    const idInput = createPropertyInput('ID', element.id);
    idInput.addEventListener('input', (e) => element.id = e.target.value);
    propertiesContent.appendChild(idInput);

    const classInput = createPropertyInput('Class', element.className);
    classInput.addEventListener('input', (e) => element.className = e.target.value);
    propertiesContent.appendChild(classInput);

    const styleInput = createPropertyInput('Style', element.style.cssText);
    styleInput.addEventListener('input', (e) => element.style.cssText = e.target.value);
    propertiesContent.appendChild(styleInput);

    // Propriedades específicas do tipo de elemento
    if (element.tagName === 'IMG') {
        const srcInput = createPropertyInput('Source', element.src);
        srcInput.addEventListener('input', (e) => element.src = e.target.value);
        propertiesContent.appendChild(srcInput);
    } else if (element.tagName === 'A') {
        const hrefInput = createPropertyInput('Href', element.href);
        hrefInput.addEventListener('input', (e) => element.href = e.target.value);
        propertiesContent.appendChild(hrefInput);
    }

    propertiesModal.classList.remove('hidden');
    currentElement = element;
}

// Função para criar um campo de input para uma propriedade
function createPropertyInput(label, value) {
    const wrapper = document.createElement('div');
    const inputLabel = document.createElement('label');
    inputLabel.textContent = label;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    wrapper.appendChild(inputLabel);
    wrapper.appendChild(input);
    return wrapper;
}

// Função para ocultar a janela de propriedades
function hideProperties() {
    const propertiesModal = document.getElementById('propertiesModal');
    propertiesModal.classList.add('hidden');
    currentElement = null;
}

// Adiciona o evento de clique nos elementos do preview para mostrar as propriedades
document.getElementById('appPreview').addEventListener('click', function(e) {
    if (e.target !== currentElement) {
        showProperties(e.target);
    }
});

// Fecha a janela de propriedades ao clicar fora dela
document.addEventListener('click', function(e) {
    if (currentElement && !document.getElementById('propertiesModal').contains(e.target) && e.target !== currentElement) {
        hideProperties();
    }
});


