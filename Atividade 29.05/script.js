let contador = 0;

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
}

function removerTarefas() {
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
}

function limparLista() {
    removerTarefas();
}