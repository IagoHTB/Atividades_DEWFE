let contador = 0;

document.addEventListener('DOMContentLoaded', () => {
    const adicionarButton = document.getElementById('adicionar_tarefa');
    if (!adicionarButton) return;

    const removerButton = document.createElement('button');
    removerButton.id = 'remover_tarefas';
    removerButton.textContent = 'Remover Tarefas';
    removerButton.style.display = 'none';
    removerButton.addEventListener('click', removerTarefas);

    adicionarButton.insertAdjacentElement('afterend', removerButton);
});

function atualizarBotaoRemover() {
    const removerButton = document.getElementById('remover_tarefas');
    if (!removerButton) return;
    removerButton.style.display = contador > 0 ? 'inline-block' : 'none';
}

function adicionarTarefa() {
    const inputElement = document.getElementById('tarefa_input');
    const mensagemElement = document.getElementById('mensagem');
    const listaElement = document.getElementById('lista_tarefas');
    const saudacaoElement = document.getElementById('mensagem_saudacao');

    let tarefa = inputElement.value.trim();

    if (tarefa === '') {
        mensagemElement.textContent = "Por favor, digite uma tarefa!";
        mensagemElement.style.color = 'red';
        return;
    }

    let novaTarefa = document.createElement('li');
    novaTarefa.textContent = tarefa;
    if (listaElement) {
        listaElement.appendChild(novaTarefa);
    }

    mensagemElement.textContent = "Tarefa adicionada com sucesso!";
    mensagemElement.style.color = 'green';
    contador++;
    
    inputElement.value = '';
    saudacaoElement.textContent = `Você tem ${contador} tarefas!`;
    atualizarBotaoRemover();
}

function removerTarefas() {
    if (contador === 0) {
        const mensagemElement = document.getElementById('mensagem');
        mensagemElement.textContent = "Não há tarefas para remover!";
        mensagemElement.style.color = 'red';
        return;
    }
    const listaElement = document.getElementById('lista_tarefas');
    const mensagemElement = document.getElementById('mensagem');
    const saudacaoElement = document.getElementById('mensagem_saudacao');

    if (listaElement) {
        listaElement.innerHTML = '';
    }

    contador = 0;
    mensagemElement.textContent = 'Todas as tarefas foram removidas!';
    mensagemElement.style.color = 'green';
    if (saudacaoElement) {
        saudacaoElement.textContent = 'Adicione Tarefas!';
    }
    atualizarBotaoRemover();
}

function limparLista() {
    removerTarefas();
}