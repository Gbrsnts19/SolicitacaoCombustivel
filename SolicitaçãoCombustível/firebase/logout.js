import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js"

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

const botaoLogout = document.getElementById('botao-logout');
botaoLogout.addEventListener("click", function (event) {
    event.preventDefault();

    signOut(auth).then(() => {
        window.location.href = "../index.html";
    }).catch((error) => {
        alert('Erro ao sair:', error);
    });
});
