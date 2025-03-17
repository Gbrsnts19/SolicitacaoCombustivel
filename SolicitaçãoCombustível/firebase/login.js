// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCAhHunp8zuPLMtxgED_Ky_BKa_GPiNsI4",
    authDomain: "solicitacao-combustivel-fa.firebaseapp.com",
    projectId: "solicitacao-combustivel-fa",
    storageBucket: "solicitacao-combustivel-fa.firebasestorage.app",
    messagingSenderId: "828673950515",
    appId: "1:828673950515:web:f475b5027766315198f446"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);



// Button
const botaoCadastro = document.getElementById('botao-login');
botaoCadastro.addEventListener("click", function (event) {
    event.preventDefault()

    // Inputs
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;

    signInWithEmailAndPassword(auth, email, senha)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            window.location.href = "solicitacao/solicitacao.html"
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
            // ..
        });
})

const esqueciSenhaLink = document.querySelector("#esqueci-senha-link-login");
const modalEsqueciSenha = document.querySelector("#modal-esqueci-senha-login");
const fecharModalBtn = document.querySelector("#fechar-modal-login");
const enviarRedefinicaoBtn = document.querySelector("#enviar-redefinicao-login");
const emailRedefinirSenhaInput = document.querySelector("#email-redefinir-senha-login");

// Abrir o modal
esqueciSenhaLink.addEventListener("click", (event) => {
    event.preventDefault();
    modalEsqueciSenha.style.display = "flex";
});

// Fechar o modal
fecharModalBtn.addEventListener("click", () => {
    modalEsqueciSenha.style.display = "none";
});

// Enviar email de redefinição de senha
enviarRedefinicaoBtn.addEventListener("click", async () => {
    const email = emailRedefinirSenhaInput.value;

    if (!email.trim()) {
        alert("Por favor, preencha o email.");
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        alert("Email de redefinição de senha enviado! Verifique sua caixa de entrada.");
        modalEsqueciSenha.style.display = "none"; // Fecha o modal
    } catch (error) {
        console.error("Erro ao enviar email de redefinição:", error);
        alert("Erro ao enviar o email. Verifique o endereço e tente novamente.");
    }
});