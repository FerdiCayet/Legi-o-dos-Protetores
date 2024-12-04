const errorDialog = document.getElementById('errorDialog');
const dialogMessage = document.getElementById('dialogMessage');
const closeDialogButton = document.getElementById('closeDialog');

const sections = document.querySelectorAll('.section');
const tabs = document.querySelectorAll('.tab');
const btnPrevious = document.getElementById('btnPrevious');
const btnNext = document.getElementById('btnNext');

const email = document.getElementById('email');
const secretID = document.getElementById('secretID');
const gender = document.querySelectorAll('input[name="gender"]');
const birthdate = document.getElementById('birthdate');
const fileInput = document.querySelector('input[type="file"]');
const validTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
const files = fileInput.files;

const checkboxes = document.querySelectorAll('input[name="superPoderes"]');
const checkboxesArray = Array.from(checkboxes);
const otherCheckbox = document.getElementById('other');
const otherText = document.getElementById('otherText');
const specialSkills = document.getElementById('specialSkills');
const equipments = document.getElementById('equipments');

const origin = document.getElementById('origin');
const affiliation = document.getElementById('affiliation');
const areaOfOperation = document.getElementById('areaOfOperation');
const specificArea = document.getElementById('specificArea');
const missionsCompleted = document.getElementById('missionsCompleted');
const increaseButton = document.getElementById('increase');
const decreaseButton = document.getElementById('decrease');

const phoneInput = document.getElementById('phone');
const msg = document.getElementById('msg');

const submitButton = document.querySelector('input[type="submit"]');

let currentSectionIndex = 0;

closeDialogButton.addEventListener('click', () => {
    errorDialog.close();
});

function updateButtonAndTooltip() {
    const buttonText = fileInput.files.length > 0 ? (fileInput.files.length > 1 ? `Adicionar ${fileInput.files.length} anexos` : fileInput.files[0].name) : 'Adicionar anexo';
    const button = document.querySelector('.upload');
    const filename = button.querySelector('.attachment-file');
    filename.textContent = buttonText;

    const fileNames = Array.from(fileInput.files).map(file => file.name);
    button.title = fileNames.join(', ');
}

fileInput.addEventListener('change', updateButtonAndTooltip);
updateButtonAndTooltip();

function updateCheck(){
    if (otherCheckbox.checked) {
        otherText.disabled = false;
        otherText.setAttribute('data-required', 'true');
        otherText.setAttribute('required', 'required');
        otherText.classList.add('enabled');
        otherText.focus();
    } else {
        otherText.disabled = true;
        otherText.removeAttribute('required');
        otherText.removeAttribute('data-required');
        otherText.classList.remove('enabled');
    }
}

otherCheckbox.addEventListener('change', updateCheck);
updateCheck();

function enabledSpecificArea() {
    const specificAreaGroup = document.getElementById('specificAreaGroup');
    const label = specificAreaGroup.querySelector('label');
    specificArea.setAttribute('data-required', 'true');
    specificArea.setAttribute('required', 'required');

    specificAreaGroup.classList.add('enabled');

    switch (areaOfOperation.value) {
        case 'Cidade':
            label.textContent = 'Especifique a cidade de atuação:';
            break;
        case 'Estado':
            label.textContent = 'Especifique o estado de atuação:';
            break;
        case 'País':
            label.textContent = 'Especifique o país de atuação:';
            break;
        case 'Global':
            label.textContent = 'Especifique os detalhes da atuação global:';
            break;
        default:
            specificAreaGroup.classList.remove('enabled');
            specificArea.removeAttribute('data-required');
            specificArea.removeAttribute('required');
            return;
    }
}

areaOfOperation.addEventListener('change', enabledSpecificArea);
enabledSpecificArea();

function showSection(index) {
    sections.forEach((section, i) => {
        section.classList.toggle('active', i === index);
        toggleRequired(section, i === index);
    });

    tabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
    });

    btnPrevious.disabled = index === 0;
    btnNext.disabled = index === sections.length - 1;
}

function toggleRequired(section, isActive) {
    const inputs = section.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.hasAttribute('data-required')) {
            if (isActive) {
                input.setAttribute('required', 'required');
            } else {
                input.removeAttribute('required');
            }
        }
    });
}

sections.forEach(section => {
    const inputs = section.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
        input.setAttribute('data-required', 'true');
    });
});

btnPrevious.addEventListener('click', function () {
    if (currentSectionIndex > 0) {
        currentSectionIndex--;
        showSection(currentSectionIndex);
    }
});

btnNext.addEventListener('click', function () {
    if (currentSectionIndex < sections.length - 1) {
        currentSectionIndex++;
        showSection(currentSectionIndex);
    }
});

showSection(currentSectionIndex);

function toggleButtons() {
    decreaseButton.disabled = missionsCompleted.value <= 0;
}

increaseButton.addEventListener('click', () => {
    missionsCompleted.value = parseInt(missionsCompleted.value || 0) + 1;
    toggleButtons();
});

decreaseButton.addEventListener('click', () => {
    missionsCompleted.value = parseInt(missionsCompleted.value || 0) - 1;
    toggleButtons();
});

missionsCompleted.addEventListener('input', () => {
    missionsCompleted.value = missionsCompleted.value.replace(/[^0-9]/g, '');
    toggleButtons();
});

toggleButtons();

phoneInput.addEventListener('input', function (e) {
    var phoneInput = e.target.value.replace(/\D/g, '');
    if (phoneInput.length > 11) phoneInput = phoneInput.slice(0, 11);
    phoneInput = phoneInput.replace(/(\d{2})(\d)/, '($1) $2');
    phoneInput = phoneInput.replace(/(\d{5})(\d)/, '$1-$2');
    e.target.value = phoneInput;
});

function disableButton() {
    submitButton.disabled = true;
    submitButton.value = 'Enviando...';
}

function enableButton() {
    submitButton.disabled = false;
    submitButton.value = 'Envie agora';
}

function showToast(response) {
    var container = document.querySelector('.toast-container');
    var toast = document.createElement('div');
    toast.className = 'toast';

    if (response.includes('OK')) {
        toast.classList.add('toast-success');
        toast.innerHTML = '<span class="icon icon-success"></span><p>Envio realizado com sucesso!</p>';
    } else if (response.includes('gender')) {
        toast.classList.add('toast-warning');
        toast.innerHTML = '<span class="icon icon-warning"></span><p>Por favor, selecione pelo menos um gênero para continuar.</p>';
    } else if (response.includes('Mailbox name not allowed')) {
        toast.classList.add('toast-warning');
        toast.innerHTML = '<span class="icon icon-warning"></span><p>A resposta do servidor foi que o endereço de e-mail do remetente não é permitido.</p>';
    } else if (response.includes('Arquivos suportados')) {
        toast.classList.add('toast-warning');
        toast.innerHTML = '<span class="icon icon-warning"></span><p>Arquivos JPEG, JPG, PNG ou GIF são permitidos.</p>';
    } else if (response.includes('O formato do e-mail informado é inválido')) {
        toast.classList.add('toast-warning');
        toast.innerHTML = '<span class="icon icon-warning"></span><p>O formato do e-mail informado é inválido. Por favor, verifique o endereço de e-mail e tente novamente.</p>';
    } else if (response.includes('Outro')) {
        toast.classList.add('toast-warning');
        toast.innerHTML = '<span class="icon icon-warning"></span><p>Por favor, informe o superpoder no campo "Outro".</p>';
    } else if (response.includes('superPoderes')) {
        toast.classList.add('toast-warning');
        toast.innerHTML = '<span class="icon icon-warning"></span><p>Por favor, selecione pelo menos um superpoder para continuar.</p>';
    } else if (response.includes('"path" or "data" of attachment is required')) {
        toast.classList.add('toast-warning');
        toast.innerHTML = '<span class="icon icon-warning"></span><p>Por favor, insira um anexo válido. Certifique-se de fornecer o caminho do arquivo ou os dados do anexo.</p>';
    } else if (response.includes('ESOCKET')) {
        toast.classList.add('toast-failed');
        toast.innerHTML = '<span class="icon icon-failed"></span><p>Ocorreu um problema de rede ao tentar se conectar ao servidor de e-mail. Por favor, tente novamente.</p>';
    } else {
        toast.classList.add('toast-failed');
        toast.innerHTML = '<span class="icon icon-failed"></span><p>O envio de e-mail não foi bem-sucedido. Por favor, tente novamente.</p>';
    }

    container.appendChild(toast);
    toast.style.display = '-webkit-inline-box';
    setTimeout(function() {
        toast.classList.add('fade-out');
        setTimeout(function() {
            container.removeChild(toast);
        }, 500);
    }, 6000);
}

// Event listener para enviar o formulário
async function submitForm(event) {
    event.preventDefault();

    /* INFORMAÇÕES PESSOAIS */

    // Verifica se os campos especiais estão preenchidos quando requeridos
    if ((!email.value && email.hasAttribute('data-required')) || 
        (!secretID.value && secretID.hasAttribute('data-required')) || 
        (!Array.from(gender).some(radio => radio.checked) && Array.from(gender).some(radio => radio.hasAttribute('data-required'))) ||
        (!birthdate.value && birthdate.hasAttribute('data-required')) || 
        (!fileInput.value && fileInput.hasAttribute('data-required')) ||
        (files.length > 0 && !Array.from(files).every(file => validTypes.includes(file.type)))) {
        currentSectionIndex = 0;
        showSection(currentSectionIndex);

        if (!Array.from(files).every(file => validTypes.includes(file.type))) {
            showToast('Arquivos suportados');
            return;
        }

        // Focar no primeiro campo obrigatório vazio
        if (!email.value && email.hasAttribute('data-required')) email.focus();
        else if (!secretID.value && secretID.hasAttribute('data-required')) secretID.focus();
        else if (!Array.from(gender).some(radio => radio.checked) && Array.from(gender).some(radio => radio.hasAttribute('data-required'))) showToast('gender');
        else if (!birthdate.value && birthdate.hasAttribute('data-required')) birthdate.focus();
        else if (!fileInput.value && fileInput.hasAttribute('data-required')) showToast('"path" or "data" of attachment is required');

        console.group('Consulte os campos obrigatórios não preenchidos...');
        console.log(`Endereço de e-mail: ${email.value || 'não preenchido'}, é um campo obrigatório? ${email.hasAttribute('data-required') ? 'Sim' : 'Não'}`);
        console.log(`Identidade Secreta: ${secretID.value || 'não preenchido'}, é um campo obrigatório? ${secretID.hasAttribute('data-required') ? 'Sim' : 'Não'}`);
        Array.from(gender).forEach(e => {
            if (e.checked) {
                console.log(`Gênero: ${e.value}, é um campo obrigatório? ${e.hasAttribute('data-required') ? 'Sim' : 'Não'}`);
            }
        });
        console.log(`Data de nascimento: ${birthdate.value || 'não preenchido'}, é um campo obrigatório? ${birthdate.hasAttribute('data-required') ? 'Sim' : 'Não'}`);
        console.log(`Arquivos selecionados: ${Array.from(fileInput.files).map(file => file.name).join(', ') || 'nenhum arquivo selecionado'}, é um campo obrigatório? ${fileInput.hasAttribute('data-required') ? 'Sim' : 'Não'}`);
        console.groupEnd();

        return;
    }

    /* SUPERPODERES E HABILIDADES */

    // Verifica se ao menos um superpoder foi selecionado
    if (!checkboxesArray.some(checkbox => checkbox.checked)) {
        showToast('superPoderes');
        currentSectionIndex = 1;
        showSection(currentSectionIndex);
        return;
    }

    // Verifica se o campo "Outro" foi selecionado e se o campo de texto "Outro" está preenchido
    if (otherCheckbox.checked && !otherText.value) {
        showToast('Outro');
        currentSectionIndex = 1;
        showSection(currentSectionIndex);
        otherText.focus();
        return;
    }

    if ((!specialSkills.value && specialSkills.hasAttribute('data-required')) || 
        (!equipments.value && equipments.hasAttribute('data-required'))) {
        currentSectionIndex = 1;
        showSection(currentSectionIndex);

        if (!specialSkills.value && specialSkills.hasAttribute('data-required')) specialSkills.focus();
        else if (!equipments.value && equipments.hasAttribute('data-required')) equipments.focus();

        console.group('Consulte os campos obrigatórios não preenchidos...');
        Array.from(document.querySelectorAll('input[name="superPoderes"]:checked')).forEach(checkbox => {
            console.log(`Superpoder: ${checkbox.value}, é um campo obrigatório? ${checkbox.hasAttribute('data-required') ? 'Sim' : 'Não'}`);
            if (checkbox.value === 'Outro') {
                console.log(`Outro texto: ${otherText.value || 'não preenchido'}, é um campo obrigatório? ${otherText.hasAttribute('data-required') ? 'Sim' : 'Não'}`);
            }
        });
        console.log(`Habilidades especiais: ${specialSkills.value || 'não preenchido'}, é um campo obrigatório? ${specialSkills.hasAttribute('data-required') ? 'Sim' : 'Não'}`);
        console.log(`Equipamentos: ${equipments.value || 'não preenchido'}, é um campo obrigatório? ${equipments.hasAttribute('data-required') ? 'Sim' : 'Não'}`);
        console.groupEnd();

        return;
    }

    /* ATUAÇÃO */

    if ((!origin.value && origin.hasAttribute('data-required')) || 
        (!affiliation.value && affiliation.hasAttribute('data-required')) || 
        (!areaOfOperation.value && areaOfOperation.hasAttribute('data-required')) || 
        (areaOfOperation.hasAttribute('data-required') && areaOfOperation.value !== '' && !specificArea.value) ||
        (!missionsCompleted.value && missionsCompleted.hasAttribute('data-required'))) {
        currentSectionIndex = 2;
        showSection(currentSectionIndex);

        if (!origin.value && origin.hasAttribute('data-required')) origin.focus();
        else if (!affiliation.value && affiliation.hasAttribute('data-required')) affiliation.focus();
        else if (!areaOfOperation.value && areaOfOperation.hasAttribute('data-required')) areaOfOperation.focus();
        else if(areaOfOperation.hasAttribute('data-required') && areaOfOperation.value !== '' && !specificArea.value) specificArea.focus();
        else if (!missionsCompleted.value && missionsCompleted.hasAttribute('data-required')) missionsCompleted.focus();

        console.group('Consulte os campos obrigatórios não preenchidos...');
        console.log(`Origem: ${origin.value || 'não preenchido'}, é um campo obrigatório? ${origin.hasAttribute('data-required') ? 'Sim' : 'Não'}`);
        console.log(`Afiliação: ${affiliation.value || 'não preenchido'}, é um campo obrigatório? ${affiliation.hasAttribute('data-required') ? 'Sim' : 'Não'}`);
        console.log(`Área de atuação: ${areaOfOperation.value || 'não preenchido'}, é um campo obrigatório? ${areaOfOperation.hasAttribute('data-required') ? 'Sim' : 'Não'}`);
        console.log(`Especifique a área de atuação: ${specificArea.value || 'não preenchido'}, é um campo obrigatório? ${areaOfOperation.hasAttribute('data-required') ? 'Sim' : 'Não'}`);
        console.log(`Missões completadas: ${missionsCompleted.value || 'não preenchido'}, é um campo obrigatório? ${missionsCompleted.hasAttribute('data-required') ? 'Sim' : 'Não'}`);
        console.groupEnd();

        return;
    }

    /* CONTATO */

    if ((!phoneInput.value && phoneInput.hasAttribute('data-required')) || 
        (!msg.value && msg.hasAttribute('data-required'))) {
        currentSectionIndex = 3;
        showSection(currentSectionIndex);

        if (!phoneInput.value && phoneInput.hasAttribute('data-required')) phoneInput.focus();
        else if (!msg.value && msg.hasAttribute('data-required')) msg.focus();

        console.group('Consulte os campos obrigatórios não preenchidos...');
        console.log(`Celular: ${phoneInput.value || 'não preenchido'}, é um campo obrigatório? ${phoneInput.hasAttribute('data-required') ? 'Sim' : 'Não'}`);
        console.log(`${secretID.value || 'O usuário'} escreveu uma mensagem: ${msg.value || 'não preenchido'}, é um campo obrigatório? ${msg.hasAttribute('data-required') ? 'Sim' : 'Não'}`);
        console.groupEnd();

        return;
    }

    // Colete os valores dos checkboxes
    const arrayCheckboxes = document.querySelectorAll('input[name="superPoderes"]:checked');
    const superPoderes = Array.from(arrayCheckboxes).map(checkbox => checkbox.value);

    // Adiciona o valor do campo "Outro" ao array de superPoderes, se selecionado
    // if (otherCheckbox.checked) {
    //     superPoderes.push(otherText.value);
    // }

    // Crie um novo FormData e adicione os valores dos checkboxes
    const dataForm = new FormData(event.target);
    dataForm.delete('filesInput');

    // Adicione os arquivos de volta ao FormData
    Array.from(files).forEach((file, index) => {
        dataForm.append('filesInput[]', file);
    });

    // Adicione os valores dos checkboxes
    dataForm.set('superPoderes', superPoderes.join(', '));

    disableButton();

    try {
        const response = await fetch('https://form-legiaodosprotetores.vercel.app/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ email: dataForm.get('email'), name: dataForm.get('secretID') }),
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Success:', result.message);

            try{
                const response = await fetch('https://form-legiaodosprotetores.vercel.app/api/sendEmail', {
                    method: 'POST',
                    body: dataForm
                });
            
                const contentType = response.headers.get('content-type');
            
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('A resposta não é JSON');
                }
            
                const result = await response.json();
            
                if(result.success){
                    console.log('Success:', result.message);
                    showToast('OK');
                    document.getElementById('myForm').reset();
                    document.querySelector('.attachment-file').textContent = 'Adicionar anexo';
                    enableButton();
                }else{
                    if (result.message.includes('O formato do e-mail informado é inválido')) {
                        showToast('O formato do e-mail informado é inválido');
                    } else if (result.message.includes('Domínio de e-mail inválido ou inacessível')) {
                        dialogMessage.textContent = 'O domínio do e-mail informado é inválido ou não pode ser acessado. Por favor, verifique o endereço de e-mail e tente novamente.';
                        errorDialog.showModal();
                    } else if (result.message.includes('Erro na validação do domínio')) {
                        console.error('Erro interno na validação do e-mail.');
                    } else {
                        console.error('Erro no registro:', result);
                    }
                    enableButton();
                }
            } catch (error) {
                console.error('Erro na requisição de envio de e-mail:', error);
                enableButton();
            }
        } else {
            if(result.message === 'E-mail já cadastrado.'){
                console.error('E-mail já cadastrado.');
                dialogMessage.textContent = 'Lamentamos, mas o cadastro informado já existe em nosso sistema. Não é necessário preencher o formulário novamente.';
                errorDialog.showModal();
                enableButton();
            }else{
                console.error('Error no registro:', result.message);
                dialogMessage.textContent = result.message;
                errorDialog.showModal();
                enableButton();
            }
        }
    } catch (error) {
        console.error('Error ao registrar usuário:', error);
        enableButton();
    }
};

document.getElementById('myForm').addEventListener('submit', submitForm);