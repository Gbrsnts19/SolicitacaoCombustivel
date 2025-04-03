import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCAhHunp8zuPLMtxgED_Ky_BKa_GPiNsI4",
    authDomain: "solicitacao-combustivel-fa.firebaseapp.com",
    projectId: "solicitacao-combustivel-fa",
    storageBucket: "solicitacao-combustivel-fa.firebasestorage.app",
    messagingSenderId: "828673950515",
    appId: "1:828673950515:web:f475b5027766315198f446"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

function gerarNumeroRequisicao() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');

    return `${year}${month}${day}${hour}${minute}${second}`;
}

async function gerarPDF() {
    let nomeFuncionario = document.getElementById('nome-condutor').value;
    let posto = document.getElementById('posto-gasolina').value;
    let modeloCarro = document.getElementById('modelo-carro').value;
    let placaCarro = document.getElementById('placa-carro').value.replace(/\s+/g, '-');
    let observacao = document.getElementById('observ').value || "Nenhuma observação";
    let validade = document.getElementById('validade-solicitacao').value;
    let produto = document.getElementById('produto').value;
    let quantidade = document.getElementById('quantidade-litros').value;
    let km = document.getElementById('km').value;
    let kmNumero = parseInt(km, 10);
    let kmFormatado = kmNumero.toLocaleString('en-US').replace(/,/g, '.');
    let assinatura = "______________________________________";

    if (!nomeFuncionario || !posto || !modeloCarro || !placaCarro || !validade || !produto || !quantidade || !km) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let numeroRequisicao = gerarNumeroRequisicao();

    const imgUrl = '../assets/img/frangoamericano.jpeg';
    doc.addImage(imgUrl, 'JPEG', 10, 5, 30, 15);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Solicitação de Combustível", 105, 15, null, null, "center");

    doc.setFontSize(12);
    doc.text(`Número de Requisição: ${numeroRequisicao}`, 105, 20, null, null, "center");

    doc.setFontSize(12);
    let margemEsquerda = 10;
    let margemDireita = 110;
    let larguraTexto = 90;
    let y = 30;

    function adicionarLinha(tituloEsq, valorEsq, tituloDir, valorDir) {
        doc.setFont("helvetica", "bold");
        doc.text(tituloEsq + ":", margemEsquerda, y);
        doc.text(tituloDir + ":", margemDireita, y);

        doc.setFont("helvetica", "normal");

        let valorEsqQuebrado = doc.splitTextToSize(valorEsq, larguraTexto);
        let valorDirQuebrado = doc.splitTextToSize(valorDir, larguraTexto);

        doc.text(valorEsqQuebrado, margemEsquerda, y + 6);
        doc.text(valorDirQuebrado, margemDireita, y + 6);

        let linhasUsadas = Math.max(valorEsqQuebrado.length, valorDirQuebrado.length);
        y += 10 * linhasUsadas + 6;
    }

    adicionarLinha("Condutor", nomeFuncionario, "Posto", posto);
    adicionarLinha("Modelo Veículo", modeloCarro, "Placa", placaCarro);
    adicionarLinha("Observação", observacao, "Validade Requisição", validade);
    adicionarLinha("Produto", produto, "Quantidade (LT)", quantidade);
    adicionarLinha("KM", kmFormatado, "Assinatura", assinatura);

    doc.setFont("helvetica", "normal");

    doc.save('solicitacao_combustivel.pdf');

    const pdfBase64 = doc.output("datauristring");

    const user = auth.currentUser;
    if (!user) {
        alert("Usuário não autenticado!");
        return;
    }

    try {
        await addDoc(collection(db, "solicitacoes"), {
            userId: user.uid,
            nomeFuncionario,
            posto,
            modeloCarro,
            placaCarro,
            observacao,
            validade,
            produto,
            quantidade,
            km: kmFormatado,
            numeroRequisicao,
            pdf: pdfBase64,
            dataHora: new Date().toISOString(),
        });
        console.log("Dados e PDF salvos com sucesso!");
    } catch (error) {
        console.error("Erro ao salvar os dados no Firebase:", error);
        alert("Não foi possível salvar a solicitação. Por favor, tente novamente mais tarde.");
    }
}

window.gerarPDF = gerarPDF;