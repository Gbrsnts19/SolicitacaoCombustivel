import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCAhHunp8zuPLMtxgED_Ky_BKa_GPiNsI4",
    authDomain: "solicitacao-combustivel-fa.firebaseapp.com",
    projectId: "solicitacao-combustivel-fa",
    storageBucket: "solicitacao-combustivel-fa.firebasestorage.app",
    messagingSenderId: "828673950515",
    appId: "1:828673950515:web:f475b5027766315198f446"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const botaoCadastro = document.getElementById('botao-cadastro');
botaoCadastro.addEventListener("click", async function (event) {
    event.preventDefault();

    const nomeCompleto = document.getElementById('nome-completo').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!nomeCompleto.trim()) {
        alert("Por favor, preencha o nome completo.");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        await updateProfile(user, { displayName: nomeCompleto });

        window.location.href = "solicitacao/solicitacao.html";
    } catch (error) {
        console.error("Erro ao criar conta:", error);
        alert(error.message);
    }
});

const esqueciSenhaLink = document.querySelector("#esqueci-senha-link-cadastro");
const modalEsqueciSenha = document.querySelector("#modal-esqueci-senha-cadastro");
const fecharModalBtn = document.querySelector("#fechar-modal-cadastro");
const enviarRedefinicaoBtn = document.querySelector("#enviar-redefinicao-cadastro");
const emailRedefinirSenhaInput = document.querySelector("#email-redefinir-senha-cadastro");

esqueciSenhaLink.addEventListener("click", (event) => {
    event.preventDefault();
    modalEsqueciSenha.style.display = "flex";
});

fecharModalBtn.addEventListener("click", () => {
    modalEsqueciSenha.style.display = "none";
});

enviarRedefinicaoBtn.addEventListener("click", async () => {
    const email = emailRedefinirSenhaInput.value;

    if (!email.trim()) {
        alert("Por favor, preencha o email.");
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        alert("Email de redefinição de senha enviado! Verifique sua caixa de entrada.");
        modalEsqueciSenha.style.display = "none";
    } catch (error) {
        console.error("Erro ao enviar email de redefinição:", error);
        alert("Erro ao enviar o email. Verifique o endereço e tente novamente.");
    }
});