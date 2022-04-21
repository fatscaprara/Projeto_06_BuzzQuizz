//Salva as informações básicas da criação do quizz
function infoBasica_salvar_quizz() {
    const titulo = document.querySelector(".titulo-quizz").value;
    const urlImagem = document.querySelector(".imagem-url-quizz").value;
    const qtPerguntas = Number(document.querySelector(".qt-perguntas-quizz").value);
    const niveis = document.querySelector(".qt-niveis-quizz").value;

    //Verifica se os inputs do usuário atendem aos requisitos
    if ((titulo.length < 20) || (titulo.length > 65) || (qtPerguntas < 3) || (niveis < 2) || (validaURL(urlImagem) === false)) {
        alert("Preencha os dados corretamente!");
    } else {
        newQuiz = {
            title: titulo,
            image: urlImagem,
            questions: [],
            levels: [],
        }
        console.log(newQuiz);
    }
}

// Verifica se uma URL é ou não válida
function validaURL(url) {
    const regularExpression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

    return regularExpression.test(url);
}