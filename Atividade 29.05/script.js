function adicionarTarefa() {
    const inputElement = document.getElementById('tarefa_input');
    const mensagemElement = document.getElementById('mensagem');
    const listaElement = document.getElementById('lista_tarefas');

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
    inputElement.value = '';
}

 