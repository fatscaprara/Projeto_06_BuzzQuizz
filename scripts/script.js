let numPerguntas = null;
let error = false;
let objetoPerguntas = {};
let quizzCriado = [];
const urlAPI = 'https://mock-api.driven.com.br/api/v6/buzzquizz/'

//Salva as informações básicas da criação do quizz (tela 3.1)
function infoBasica_salvar_quizz() {
    const titulo = document.querySelector(".titulo-quizz").value;
    const urlImagem = document.querySelector(".imagem-url-quizz").value;
    const qtPerguntas = Number(document.querySelector(".qt-perguntas-quizz").value);
    const niveis = document.querySelector(".qt-niveis-quizz").value;

    numPerguntas = qtPerguntas
    //Verifica se os inputs do usuário atendem aos requisitos
    if ((titulo.length < 20) || (titulo.length > 65) || (qtPerguntas < 3) || (niveis < 2) || (validaURL(urlImagem) === false)) {
        alert("Preencha os dados corretamente!");
    } else {
        let quizzCriado = {
            title: titulo,
            image: urlImagem,
            questions: [],
            levels: [],
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

    //niveisQuizz();
}

//Caso alguma pergunta não atenda aos requisitos o array permanece vazio
function perguntaInvalida() {
    quizzCriado.questions = [];
}

//Checa se as perguntas do quizz que será criado atendem aos requisitos
function validarPerguntas(numPerguntas) {
    let checarResposta3 = true;
    let checarResposta4 = true;
    let respostas = [];

    const tituloPergunta = document.querySelector(".n" + numPerguntas + "Pergunta-quizz").value;
    const corPergunta = document.querySelector(".n" + numPerguntas + "Cor-quizz").value;

    const respostaCerta = document.querySelector(".n" + numPerguntas + "respostaCerta-quizz").value;
    const urlCerta = document.querySelector(".n" + numPerguntas + "urlCerta-quizz").value;

    const respostaErrada1 = document.querySelector(".n" + numPerguntas + "respostaIncorreta1").value;
    const urlErrada1 = document.querySelector(".n" + numPerguntas + "respostaIncorreta-url1").value; 

    const respostaErrada2 = document.querySelector(".n" + numPerguntas + "respostaIncorreta2").value;
    const urlErrada2 = document.querySelector(".n" + numPerguntas + "respostaIncorreta-url2").value;

    if ((respostaErrada2 === '') || (urlErrada2 === '')) {
        checarResposta3 = false;
    }

    const respostaErrada3 = document.querySelector(".n" + numPerguntas + "respostaIncorreta3").value;
    const urlErrada3 = document.querySelector(".n" + numPerguntas + "respostaIncorreta-url3").value;

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

        //Checando quais respostas foram preenchidas corretamente pra dar o push no objeto
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
            answers: respostas,
        }
    }

    console.log(quizzCriado)

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