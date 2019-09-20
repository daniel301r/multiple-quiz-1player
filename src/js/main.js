import { DOMstrings } from './view';
import { createQuiz, readyQuiz } from './model';
import * as model from './model';
import * as view from './view';

export let data = {}

const playQuiz = async (e) => {
    e.preventDefault();
    // get the inputs from the user
    const query = model.getUserInput();
    
    if(query) {
            view.toggleInputForm();
            view.renderLoader();

            // create quiz
            data.newQuiz1 = new createQuiz(query.name, query.amount, query.category, query.difficulty);
            data.newQuiz1.createFetchRequest();
            await data.newQuiz1.getQuiz();
            view.clearLoader();
    }
    data.player1 = new readyQuiz(data.newQuiz1.results, data.newQuiz1.amount, data.newQuiz1.name);
    data.player1.setQuestion();
    model.setupQuestionBoard();
}

DOMstrings.container.addEventListener('click', function(e){ 
    if (e.target.matches('.submitQuiz')) {
        playQuiz(e);
    }
});

function selectAnswer(e) {
    if (e.target.id === data.player1.correctAnswer){ // check if answer is correct
        data.player1.points++
    } 
    data.player1.nextQuestion(); 
}

DOMstrings.container.addEventListener('click', function(e){
    if (e.target.matches('li')) {
        selectAnswer(e);
    }
});

function resetQuiz() {
    if (data.player1.stage === 'result') {
        DOMstrings.resultsPage.style.display = 'none';
        view.clearHTML('.answerOptions');
        data.player1.setQuestion();
        model.setupQuestionBoard();
    } else {
        view.clearHTML('.answerOptions');
        data.player1.setQuestion();
        data.player1.updateHeader();
        data.player1.updateQuestion();
        data.player1.updateAnswers();
    }
}

document.body.addEventListener('click', function(e){
    if(e.target.matches('.startQuizAgain')){
        resetQuiz();
    }
});


function newQuiz() {
    // remove questions/answers and results page
    view.removeQandA();
    view.removeResultsPage();
    // remove btns
    view.toggleBtns();
    // add input form
    view.toggleInputForm();
    // clear quiz data from data
    data.player1 = {};
}

document.body.addEventListener('click', function(e){
    if(e.target.matches('.newQuiz')){
        newQuiz();
    }
});















