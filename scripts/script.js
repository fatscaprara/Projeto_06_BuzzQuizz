let numPerguntas = null;
let numNiveis = null;
let error = false;
let objetoPerguntas = {};
let objetoNiveis = {}
let quizzCriado = [];
let containerNivel0 = false;
let saveData;
let cont = 0;
let result;
const urlAPI = 'https://mock-api.driven.com.br/api/v6/buzzquizz/'

//Salva as informações básicas da criação do quizz (tela 3.1)
function infoBasica_salvar_quizz() {
    const titulo = document.querySelector(".titulo-quizz").value;
    const urlImagem = document.querySelector(".imagem-url-quizz").value;
    const qtPerguntas = Number(document.querySelector(".qt-perguntas-quizz").value);
    const qtniveis = document.querySelector(".qt-niveis-quizz").value;

    numPerguntas = qtPerguntas;
    numNiveis = qtniveis;

    //Verifica se os inputs do usuário atendem aos requisitos
    if ((titulo.length < 20) || (titulo.length > 65) || (qtPerguntas < 3) || (qtniveis < 2) || (validaURL(urlImagem) === false)) {
        alert("Preencha os dados corretamente!");
    } else {
        quizzCriado = {
            title: titulo,
            image: urlImagem,
            questions: [],
            levels: []
        }
        console.log(quizzCriado);
        renderizarPerguntas()
    }
}

// Verifica se uma URL é ou não válida
function validaURL(url) {
    const regularExpression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

    return regularExpression.test(url);
}

//Renderiza as perguntas do quizz que o usuário irá criar (tela 3.2)
function renderizarPerguntas() {
    const esconder = document.querySelector('.primeira-pagina');
    esconder.classList.add("escondido");
    const mostrar = document.querySelector('.segunda-pagina');
    mostrar.classList.remove('escondido');
    
    let perguntasQuizz = document.querySelector(".perguntas-criacao-quizz");

    for (let i = 0; i < numPerguntas; i++) {
        perguntasQuizz.innerHTML += `
        <div onclick="expandirPerguntas(${i + 1})" class="nome-questao" data-identifier="expand">
            <h2>Pergunta ${i + 1}</h2>
            <button><ion-icon class="iconeQuizz" name="create-outline"></ion-icon></button>
        </div>
        <div class="container${i + 1} escondido">
            <div class="conteudo">
                <input type="text" class="n${i + 1}Pergunta-quizz" placeholder="Texto da pergunta" data-identifier="question">
                <input type="text" placeholder="Cor de fundo da pergunta" class="n${i + 1}Cor-quizz">
                <h2>Resposta correta</h2>
                <input type="text" placeholder="Resposta correta" class="n${i + 1}respostaCerta-quizz">
                <input type="text" placeholder="URL da imagem" class="n${i + 1}urlCerta-quizz">
                <h2>Respostas incorretas</h2>
                <input type="text"  class="spaceCss n${i + 1}respostaIncorreta1" placeholder="Resposta incorreta 1">
                <input type="text" class="n${i + 1}respostaIncorreta-url1" placeholder="URL da imagem 1">
                <input type="text"  class="spaceCss n${i + 1}respostaIncorreta2" placeholder="Resposta incorreta 2">
                <input type="text" class="n${i + 1}respostaIncorreta-url2" placeholder="URL da imagem 2">
                <input type="text"  class="spaceCss n${i + 1}respostaIncorreta3" placeholder="Resposta incorreta 3">
                <input type="text" class="n${i + 1}respostaIncorreta-url3" placeholder="URL da imagem 3">
            </div>
        </div>
        `
    }

    perguntasQuizz.innerHTML += `<button class="prosseguir" onclick="salvarPerguntasCriadas()">Prosseguir pra criar níveis</button>
    `
}

//Expande os campos de criação de perguntas, durante a criação do quizz
function expandirPerguntas (numeroQuestao) {
    let questao = document.querySelector(".container" + numeroQuestao);
    questao.classList.toggle("escondido");
}

//Função pra validar input hexadecimal
function validaHexa(color) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(color);
}

//Caso todas as perguntas sejam validadas, elas serão salvas
function salvarPerguntasCriadas() {
    error = false

    for (i = 0; i < numPerguntas; i++) {
        validarPerguntas(i + 1);
        if (error) {
            alert("Preencha os dados corretamente!");
            objetoPerguntas = {};
            perguntaInvalida();
            return;
        } else {
            quizzCriado.questions.push(objetoPerguntas);
        }
    }

    renderizarNiveis();
}

//Caso alguma pergunta não atenda aos requisitos o array permanece vazio
function perguntaInvalida() {
    quizzCriado.questions = [];
}

//Checa se as perguntas do quizz que será criado atendem aos requisitos
function validarPerguntas(valorPergunta) {
    let checarResposta3 = true;
    let checarResposta4 = true;
    let respostas = [];

    const tituloPergunta = document.querySelector(".n" + valorPergunta + "Pergunta-quizz").value;
    const corPergunta = document.querySelector(".n" + valorPergunta + "Cor-quizz").value;

    const respostaCerta = document.querySelector(".n" + valorPergunta + "respostaCerta-quizz").value;
    const urlCerta = document.querySelector(".n" + valorPergunta + "urlCerta-quizz").value;

    const respostaErrada1 = document.querySelector(".n" + valorPergunta + "respostaIncorreta1").value;
    const urlErrada1 = document.querySelector(".n" + valorPergunta + "respostaIncorreta-url1").value; 

    const respostaErrada2 = document.querySelector(".n" + valorPergunta + "respostaIncorreta2").value;
    const urlErrada2 = document.querySelector(".n" + valorPergunta + "respostaIncorreta-url2").value;

    if ((respostaErrada2 === '') || (urlErrada2 === '')) {
        checarResposta3 = false;
    }

    const respostaErrada3 = document.querySelector(".n" + valorPergunta + "respostaIncorreta3").value;
    const urlErrada3 = document.querySelector(".n" + valorPergunta + "respostaIncorreta-url3").value;

    if ((respostaErrada3 === '') || (urlErrada3 === '')) {
        checarResposta4 = false;
    }

    if ((tituloPergunta.length < 20) || (respostaCerta === '') || (validaURL(urlCerta) === false) || (validaHexa(corPergunta) === false) || (respostaErrada1 === '') || (validaURL(urlErrada1) === false)) {
        error = true;
    } else {
        
        const resposta1 = {
            text: respostaCerta,
            image: urlCerta,
            isCorrectAnswer: true
        }

        const resposta2 = {
            text: respostaErrada1,
            image: urlErrada2,
            isCorrectAnswer: false
        }

        const resposta3 = {
            text: respostaErrada2,
            image: urlErrada2,
            isCorrectAnswer: false
        }

        const resposta4 = {
            text: respostaErrada3,
            image: urlErrada3,
            isCorrectAnswer: false
        }

        //Checa quais respostas foram preenchidas corretamente pra dar o push no objeto
        if ((checarResposta3 === true) && (checarResposta4 === true)) {
            respostas.push(resposta1, resposta2, resposta3, resposta4);
        }

        if ((checarResposta3 === true) && (checarResposta4 === false)) {
            respostas.push(resposta1, resposta2, resposta3);
        }

        if ((checarResposta3 === false) && (checarResposta4 === false)) {
            respostas.push(resposta1, resposta2);
        }

        objetoPerguntas = {
            title: tituloPergunta,
            color: corPergunta,
            answers: respostas
        }
    }

    console.log(quizzCriado)

}

//Renderiza os niveis do quizz que o usuário irá criar (tela 3.3)
function renderizarNiveis() {
    const esconder = document.querySelector('.segunda-pagina');
    esconder.classList.add("escondido");
    const mostrar = document.querySelector('.terceira-pagina');
    mostrar.classList.remove('escondido');

    const criarNiveis = document.querySelector(".niveis-criacao-quizz");

    for (let i = 0; i < numNiveis; i++) {
        criarNiveis.innerHTML += `
        <div onclick="expandirNiveis(${i + 1})" class="nome-questao" data-identifier="expand">
            <h2>Nível ${i + 1}</h2>
            <button><ion-icon class="iconeQuizz" name="create-outline"></ion-icon></button>
        </div>
        <div class="container1${i + 1} escondido">
            <div class="conteudo">
                <input type="text" class="n${i + 1}titulo-nivel" placeholder="Título do nível" data-identifier="level">
                <input type="text" class="n${i + 1}min-nivel" placeholder="% de acerto mínima">
                <input type="text" class="n${i + 1}url-nivel" placeholder="URL da imagem do nível">
                <input type="text" class="n${i + 1}descricao-nivel nivelDesc" placeholder="Descrição do nível">
            </div>
        </div>
        `
    }

    criarNiveis.innerHTML += `<button class="prosseguir" onclick="salvarNiveisCriados()">Finalizar Quizz</button>`
}
   
//Expande os campos de criação de niveis, durante a criação do quizz
function expandirNiveis (numeroNivel) {
    let nivel = document.querySelector(".container1" + numeroNivel);
    nivel.classList.toggle('escondido');
}

//Caso todos os níveis sejam validados eles serão salvos
function salvarNiveisCriados(){
    error = false;
    containerNivel0 = false;
    for (i = 0; i < numNiveis; i++) {
        validarNiveis(i + 1);
        if ((error === true) || (containerNivel0 === false)) {
            alert("Preencha os campos corretamente!")
            objetoNiveis = {};
            nivelInvalido();
            return;
        } else {
            quizzCriado.levels.push(objetoNiveis)
        }
    }
    enviarQuizz()
}

//Caso algum nivel não atenda aos requisitos o array permanece vazio
function nivelInvalido() {
    quizzCriado.levels = [];
}

//Checa se os níveis do quizz que será criado atendem aos requisitos
function validarNiveis (valorNivel) {
    const tituloNivel = document.querySelector(".n" + valorNivel + "titulo-nivel").value;
    const minNivel = document.querySelector(".n" + valorNivel + "min-nivel").value;
    const urlNivel = document.querySelector(".n" + valorNivel + "url-nivel").value;
    const descricaoNivel = document.querySelector(".n" + valorNivel + "descricao-nivel").value;

    if (minNivel == 0) {
        containerNivel0 = true;
    }

    if ((tituloNivel.length < 10) || (minNivel < 0) || (minNivel > 100) || (validaURL(urlNivel) === false) || (descricaoNivel < 30)) {
        error = true;
    } else {

        objetoNiveis = {
            title: tituloNivel,
            image: urlNivel,
            text: descricaoNivel,
            minValue: minNivel
        }
    }
}

//Após o quizz ter sido criado e validado, essa função o mandará para a API
function enviarQuizz() {
    console.log(quizzCriado);
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes", quizzCriado)
    promise.then(sucessoEnvioQuizz);
    promise.catch(erroEnvioQuizz);
}

function erroEnvioQuizz(error) {
    alert(`Erro ${error.response.status}. Não foi possível enviar o seu quizz. Tente novamente.`);
}

function sucessoEnvioQuizz(data) {
    const esconder = document.querySelector('.terceira-pagina');
    esconder.classList.add('escondido');
    const mostrar = document.querySelector('.quarta-pagina');
    mostrar.classList.remove('escondido');

    document.querySelector('.imagem-fundo-quizz').src = quizzCriado.image;
    document.querySelector('.quarta-pagina .descricao-quizz-criado').innerHTML = quizzCriado.title;

    //Aqui irá a funcao local storage para armazenar os quizzes
}

//Função para voltar à página inicial ao clicar no botão (tela 3.4) 
function voltarInicio() {
    window.location.reload(true);
}

//Após o quizz ter sido criado, permite voltar para faze-lo
function irParaQuizzCriado(quizzCriado) {
    saveData = quizzCriado;

    const esconder = document.querySelector('.quarta-pagina');
    esconder.classList.add('escondido');
    const mostrar = document.querySelector('pagina-quizz');
    mostrar.classList.remove('escondido');

    FUNCAO_RENDERIZAR_IMAGEM_QUIZZ_NOME_A_DECIDIR();
    FUNCAO_RENDERIZAR_PERGUNTAS_QUIZZ_NOME_A_DECIDIR();

    document.querySelector(".IMAGEM_DA_PAGINA_DO_QUIZZ_NOME_A_DECIDIR").scrollIntoView({block:"start"});
}

//Função para selecionar a resposta clicada e realizar as mudanças visuais necessárias
function FUNÇÃO_ONCLICK_DA_RESPOSTA_ESCOLHIDA_NOME_A_DECIDIR(respostaQuizz) {
    respostaQuizz.classList.add("selecionado")
    let conjuntoRespostas = respostaQuizz.parentNode;
    let conjuntoRespostasSelecionadas = conjuntoRespostas.querySelectorAll(".CLASSE_DAS_RESPOSTAS_DO_QUIZZ_NOME_A_DECIDIR")

    conjuntoRespostasSelecionadas.forEach(VARIAVEL_DAS_RESPOSTAS_NA_FUNCAO_DE_RENDERIZAR_NOME_A_DECIDIR => {
        let elementoSelecionado = VARIAVEL_DAS_RESPOSTAS_NA_FUNCAO_DE_RENDERIZAR_NOME_A_DECIDIR.classList.contains("selecionado")
        if (elementoSelecionado === false) {
            VARIAVEL_RESPOSTA_NOME_DECIDIR.classList.add("fog");
            VARIAVEL_RESPOSTA_NOME_DECIDIR.setAttribute("onclick", "");
        } else {
            VARIAVEL_RESPOSTA_NOME_DECIDIR.setAttribute("onclick", "");
        }

    });
    verificarResposta(respostaQuizz);
    
    /*Após a resposta ter sido verificada, irá scrollar para a próxima pergunta */
    setTimeout(() => {
        cont = cont + 1;
        blocoPergunta = `CLASSE_DE_CADA_UMA_DAS_PERGUNTAS_NOME_A_DECIDIR${cont}`;
        scrollPergunta = document.querySelector(blocoPergunta);

        if (scrollPergunta === null) {
            renderizarResultadoQuizz();
            const quizzResultado = document.querySelector(".resultado-pagina-quizz");
            quizzResultado.classList.remove("escondido")
            quizzResultado.scrollIntoView({block: "center", behavior: "smooth"})
        } else {
            scrollPergunta.scrollIntoView({block: "center", behaviour: "smooth"});
        }
    }, 2000);;
}

/* Verifica se a resposta dada em um quizz é certa ou não */
function verificarResposta (respostaQuizz) {
    let conjuntoRespostas = respostaQuizz.parentNode;
    let conjuntoRespostasSelecionadas = conjuntoRespostas.querySelectorAll(".CLASSE_DAS_RESPOSTAS_DO_QUIZZ_NOME_A_DECIDIR h3");

    let ifTrue = conjuntoRespostas.querySelector(".true h3");
    ifTrue.style.color="green"

    let ifFalse = conjuntoRespostas.querySelectorAll(".false h3").length;
    ifFalse.forEach(VARIAVEL_DAS_RESPOSTAS_NA_FUNCAO_DE_RENDERIZAR_NOME_A_DECIDIR => {VARIAVEL_DAS_RESPOSTAS_NA_FUNCAO_DE_RENDERIZAR_NOME_A_DECIDIR.style.color="red";
    });
}

//Função para renderizar os resultados de um quizz feito
function renderizarResultadoQuizz() {
    let QuantidadePerguntas = saveData.questions.length; 
    let respostaAcertadas = document.querySelectorAll(".selecionado.true").length;

    resultado = Math.round((respostaAcertadas/QuantidadePerguntas)*100);

    const niveis = saveData.levels
    niveis.forEach(level => {
        let valorMinimo = level.valorMinimo;
        if (resultado >= valorMinimo) {
            const resultadoQuizz = document.querySelector(".resultado-pagina-quizz");
            resultadoQuizz.innerHTML = `
            <div class="descricao-resultado-quizz" data-identifier="quizz-result">${resultado}% de acerto: ${level.title}</div>
            <div class="informacao-resultado-quizz">
                <img src="${level.image}">
                <p>${level.text}<p>
            </div>
            `;
        }
    });
}

//Validando se já existem quizzes criados pelos usuários
function listarQuiz(){
    const promise = axios.get(urlAPI + 'quizzes');
    promise.then(tratarSucessoListagem);
}

function tratarSucessoListagem(response){
    console.log(response.data);

    for(let i = 0; i < response.data.length; i++){
        console.log(response.data[i].title)
        document.querySelector('.listagem-quizzes').innerHTML += `
            <div class="quiz-listado">
                <img src="${response.data[i].image}" alt="">
                <h2>${response.data[i].title}</h2>
            </div>
        `
    }
}

listarQuiz();