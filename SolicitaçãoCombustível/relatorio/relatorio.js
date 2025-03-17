import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCAhHunp8zuPLMtxgED_Ky_BKa_GPiNsI4",
    authDomain: "solicitacao-combustivel-fa.firebaseapp.com",
    projectId: "solicitacao-combustivel-fa",
    storageBucket: "solicitacao-combustivel-fa.firebasestorage.app",
    messagingSenderId: "828673950515",
    appId: "1:828673950515:web:f475b5027766315198f446"
};

const db = getFirestore();
const auth = getAuth();

const tabelaBody = document.querySelector("#tabela-solicitacoes tbody");

onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("Usuário autenticado:", user.email);

        const q = query(collection(db, "solicitacoes"), where("userId", "==", user.uid));

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const dados = doc.data();
                adicionarLinhaNaTabela(dados);
            });

            if (querySnapshot.empty) {
                const linha = document.createElement("tr");
                linha.innerHTML = `<td colspan="10">Nenhuma solicitação encontrada.</td>`;
                tabelaBody.appendChild(linha);
            }
        } catch (error) {
            console.error("Erro ao buscar solicitações:", error);
            alert("Erro ao carregar as solicitações.");
        }
    } else {
        console.log("Usuário não autenticado. Redirecionando...");
        window.location.href = "login.html";
    }
});

function adicionarLinhaNaTabela(dados) {
    const linha = document.createElement("tr");
    linha.innerHTML = `
        <td>${dados.numeroRequisicao}</td>
        <td>${dados.nomeFuncionario}</td>
        <td>${dados.posto}</td>
        <td>${dados.modeloCarro}</td>
        <td>${dados.placaCarro}</td>
        <td>${dados.produto}</td>
        <td>${dados.quantidade}</td>
        <td>${dados.km}</td>
        <td>${new Date(dados.dataHora).toLocaleString()}</td>
        <td><button class="btn-download" data-pdf="${dados.pdf}">Download</button></td>
    `;
    tabelaBody.appendChild(linha);

    const btnDownload = linha.querySelector(".btn-download");
    btnDownload.addEventListener("click", () => baixarPDF(dados.pdf, dados.numeroRequisicao));
}

function baixarPDF(pdfBase64, numeroRequisicao) {
    const link = document.createElement("a");
    link.href = pdfBase64;
    link.download = `solicitacao_${numeroRequisicao}.pdf`;
    link.click();
}

const tabela = document.querySelector("#tabela-solicitacoes");
const cabecalhos = tabela.querySelectorAll("th[data-column]");
let direcaoOrdenacao = 1; // 1 para crescente, -1 para decrescente
let colunaAtiva = null; // Armazena a coluna atualmente ordenada

// Função para ordenar a tabela
function ordenarTabela(coluna, cabecalho) {
    const tbody = tabela.querySelector("tbody");
    const linhas = Array.from(tbody.rows);

    // Alterna a direção da ordenação
    if (colunaAtiva === coluna) {
        direcaoOrdenacao *= -1; // Inverte a direção
    } else {
        direcaoOrdenacao = 1; // Padrão para crescente ao mudar de coluna
        colunaAtiva = coluna;
    }

    // Remove as classes de ordenação de todos os cabeçalhos
    cabecalhos.forEach((th) => th.classList.remove("ordenado-crescente", "ordenado-decrescente"));

    // Adiciona a classe apropriada ao cabeçalho clicado
    if (direcaoOrdenacao === 1) {
        cabecalho.classList.add("ordenado-crescente");
    } else {
        cabecalho.classList.add("ordenado-decrescente");
    }

    // Ordena as linhas com base na coluna clicada
    linhas.sort((a, b) => {
        const valorA = a.querySelector(`td:nth-child(${coluna + 1})`).innerText.trim();
        const valorB = b.querySelector(`td:nth-child(${coluna + 1})`).innerText.trim();

        if (!isNaN(valorA) && !isNaN(valorB)) {
            return direcaoOrdenacao * (parseFloat(valorA) - parseFloat(valorB)); // Ordenação numérica
        }
        return direcaoOrdenacao * valorA.localeCompare(valorB); // Ordenação de strings
    });

    // Adiciona as linhas ordenadas de volta na tabela
    linhas.forEach((linha) => tbody.appendChild(linha));
}

// Adiciona o evento de clique nos cabeçalhos
cabecalhos.forEach((cabecalho, index) => {
    cabecalho.addEventListener("click", () => ordenarTabela(index, cabecalho));
});

const filtroCondutor = document.querySelector("#filtro-condutor");
const filtroPosto = document.querySelector("#filtro-posto");
const filtroModelo = document.querySelector("#filtro-modelo");
const filtroPlaca = document.querySelector("#filtro-placa");
const filtroProduto = document.querySelector("#filtro-produto");
const filtroDataInicio = document.querySelector("#filtro-data-inicio");
const filtroDataFim = document.querySelector("#filtro-data-fim");
const btnAplicarFiltro = document.querySelector("#aplicar-filtro");

function converterDataParaFormatoISO(dataHora) {
    const regex = /(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2})/;
    const match = dataHora.match(regex);
    if (match) {
        const [, dia, mes, ano] = match;
        return `${ano}-${mes}-${dia}`;
    }
    return null;
}

function aplicarFiltros() {
    const tbody = tabela.querySelector("tbody");
    const linhas = Array.from(tbody.rows);

    linhas.forEach((linha) => {
        const condutor = linha.querySelector("td:nth-child(2)").innerText.trim().toLowerCase();
        const posto = linha.querySelector("td:nth-child(3)").innerText.trim().toLowerCase();
        const modelo = linha.querySelector("td:nth-child(4)").innerText.trim().toLowerCase();
        const placa = linha.querySelector("td:nth-child(5)").innerText.trim().toLowerCase();
        const produto = linha.querySelector("td:nth-child(6)").innerText.trim().toLowerCase();
        const dataHora = linha.querySelector("td:nth-child(9)").innerText.trim();

        const dataFormatada = converterDataParaFormatoISO(dataHora);

        const filtroCondutorValor = filtroCondutor.value.toLowerCase();
        const filtroPostoValor = filtroPosto.value.toLowerCase();
        const filtroModeloValor = filtroModelo.value.toLowerCase();
        const filtroPlacaValor = filtroPlaca.value.toLowerCase();
        const filtroProdutoValor = filtroProduto.value.toLowerCase();
        const filtroDataInicioValor = filtroDataInicio.value;
        const filtroDataFimValor = filtroDataFim.value;

        const condutorValido = !filtroCondutorValor || condutor.includes(filtroCondutorValor);
        const postoValido = !filtroPostoValor || posto.includes(filtroPostoValor);
        const modeloValido = !filtroModeloValor || modelo.includes(filtroModeloValor);
        const placaValida = !filtroPlacaValor || placa.includes(filtroPlacaValor);
        const produtoValido = !filtroProdutoValor || produto.includes(filtroProdutoValor);

        let dataValida = true;

        if (filtroDataInicioValor && !filtroDataFimValor) {
            dataValida = dataFormatada === filtroDataInicioValor;
        } else if (filtroDataInicioValor && filtroDataFimValor) {
            dataValida =
                dataFormatada &&
                new Date(dataFormatada) >= new Date(filtroDataInicioValor) &&
                new Date(dataFormatada) <= new Date(filtroDataFimValor);
        }

        if (condutorValido && postoValido && modeloValido && placaValida && produtoValido && dataValida) {
            linha.style.display = "";
        } else {
            linha.style.display = "none";
        }
    });
}

btnAplicarFiltro.addEventListener("click", aplicarFiltros);