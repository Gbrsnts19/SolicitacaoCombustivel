import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, updateEmail, updatePassword, updateProfile, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCAhHunp8zuPLMtxgED_Ky_BKa_GPiNsI4",
    authDomain: "solicitacao-combustivel-fa.firebaseapp.com",
    projectId: "solicitacao-combustivel-fa",
    storageBucket: "solicitacao-combustivel-fa.firebasestorage.app",
    messagingSenderId: "828673950515",
    appId: "1:828673950515:web:f475b5027766315198f446"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const formPerfil = document.querySelector("#form-perfil");

// Elementos do formulário
const nomeCompletoInput = document.querySelector("#nome-completo");
const emailInput = document.querySelector("#email");
const senhaAntigaInput = document.querySelector("#senha-antiga");
const novaSenhaInput = document.querySelector("#nova-senha");
const salvarAlteracoesBtn = document.querySelector("#salvar-alteracoes");

// Carregar informações do usuário
auth.onAuthStateChanged((user) => {
    if (user) {
        // Exibir informações existentes
        nomeCompletoInput.value = user.displayName || "";
        emailInput.value = user.email || "";
    } else {
        alert("Usuário não autenticado. Redirecionando...");
        window.location.href = "login.html"; // Redireciona para login se não autenticado
    }
});

// Atualizar informações do perfil
salvarAlteracoesBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    const nomeCompleto = nomeCompletoInput.value;
    const email = emailInput.value;
    const senhaAntiga = senhaAntigaInput.value;
    const novaSenha = novaSenhaInput.value;

    try {
        // Reautenticar o usuário antes de alterações sensíveis
        const credential = EmailAuthProvider.credential(user.email, senhaAntiga);
        await reauthenticateWithCredential(user, credential);

        // Atualizar o nome completo
        if (nomeCompleto && nomeCompleto !== user.displayName) {
            await updateProfile(user, { displayName: nomeCompleto });
            console.log("Nome atualizado com sucesso!");
        }

        // Atualizar o email
        if (email && email !== user.email) {
            await updateEmail(user, email);
            console.log("Email atualizado com sucesso!");
        }

        // Atualizar a senha
        if (novaSenha) {
            await updatePassword(user, novaSenha);
            console.log("Senha atualizada com sucesso!");
        }

        alert("Informações atualizadas com sucesso!");
    } catch (error) {
        console.error("Erro ao atualizar as informações:", error);
        alert("Erro ao salvar as alterações. Verifique os dados e tente novamente.");
    }
});

auth.onAuthStateChanged((user) => {
    if (user) {
        nomeCompletoInput.value = user.displayName || "";
        emailInput.value = user.email || "";
    } else {
        alert("Usuário não autenticado. Redirecionando...");
        window.location.href = "../index.html";
    }
});