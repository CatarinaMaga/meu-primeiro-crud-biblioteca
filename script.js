const form = document.getElementById('form-cadastro');
let idEdicao = null; // Guarda o ID do livro que está sendo editado

function carregarLivros() {
    fetch('http://localhost:3000/livros')
        .then(res => res.json())
        .then(livros => {
            const tbody = document.getElementById('lista-corpo');
            tbody.innerHTML = ''; 
            livros.forEach(l => {
                tbody.innerHTML += `
                    <tr>
                        <td>${l.titulo}</td>
                        <td>${l.autor}</td>
                        <td>${l.ano}</td>
                        <td>
                            <button class="btn-editar" onclick="prepararEdicao(${JSON.stringify(l).replace(/"/g, '&quot;')})">Editar</button>
                            <button class="btn-excluir" onclick="excluirLivro(${l.id})">Excluir</button>
                        </td>
                    </tr>`;
            });
        });
}

// Função que joga os dados da tabela de volta para o formulário
function prepararEdicao(livro) {
    document.getElementById('titulo').value = livro.titulo;
    document.getElementById('autor').value = livro.autor;
    document.getElementById('ano').value = livro.ano;
    
    idEdicao = livro.id; // Entra em modo de edição
    form.querySelector('button').textContent = "Salvar Alterações";
    form.querySelector('button').style.background = "#3498db";
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const dados = {
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        ano: document.getElementById('ano').value
    };
    console.log("Dados que estou enviando:", dados);
    
    const url = idEdicao ? `http://localhost:3000/livros/${idEdicao}` : 'http://localhost:3000/livros';
    const metodo = idEdicao ? 'PUT' : 'POST';

    fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    }).then(() => {
        idEdicao = null; // Sai do modo de edição
        form.reset();
        form.querySelector('button').textContent = "Adicionar à Coleção";
        form.querySelector('button').style.background = "#27ae60";
        carregarLivros();
    });
});

function excluirLivro(id) {
    if (confirm('Deseja excluir?')) {
        fetch(`http://localhost:3000/livros/${id}`, { method: 'DELETE' }).then(() => carregarLivros());
    }
}

carregarLivros();