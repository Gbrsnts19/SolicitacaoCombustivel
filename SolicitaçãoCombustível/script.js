function cadastrar() {
    let nome = document.getElementById('nome').value;
    let email = document.getElementById('email').value;
    let senha = document.getElementById('senha').value;
    let confirmacaoSenha = document.getElementById('confirmacaoSenha').value;

    if (!nome || !email || !senha || !confirmacaoSenha) {
        alert('Preencha todos os campos!');
        return;
    }

    if (senha !== confirmacaoSenha) {
        alert('As senhas não são iguais!')
        return;
    }
}

function mostrarLogin() {
    document.getElementById('container-cadastro').style.display = 'none';
    document.getElementById('container-login').style.display = 'block';
    document.getElementById('container-report').style.display = 'none';
    document.getElementById('navbar').style.display = 'none';
}

function mostrarCadastro() {
    document.getElementById('container-cadastro').style.display = 'block';
    document.getElementById('container-login').style.display = 'none';
}