const questions = [
  {
    text: "Если человека назвали мордофиля, то это…",
    comment: "Ну зачем же вы так... В Этимологическом словаре русского языка Макса Фасмера поясняется," +
      " что мордофилей называют чванливого человека. Ну а «чванливый» — это высокомерный, тщеславный.",
    answers: [
      {text: "Значит, что он тщеславный.", correct: true},
      {text: "Значит, что у него лицо как у хряка.", correct: false},
      {text: "Значит, что чумазый.", correct: false}
    ]
  },
  {
    text: "«Да этот Ярополк — фуфлыга!» Что не так с Ярополком?",
    comment: "Точно! Словарь Даля говорит, что фуфлыгой называют невзрачного малорослого человека." +
      " А еще так называют прыщи.",
    answers: [
      {text: "Он маленький и невзрачный.", correct: true},
      {text: "Он тот еще алкоголик.", correct: false},
      {text: "Он не держит свое слово.", correct: false}
    ]
  },
  {
    text: "Если человека прозвали пятигузом, значит, он…",
    comment: "Может сесть сразу на пять стульев. Согласно Этимологическому словарю русского языка Макса Фасмера," +
      " пятигуз — это ненадежный, непостоянный человек.",
    answers: [
      {text: "Не держит слово.", correct: true},
      {text: "Изменяет жене.", correct: false},
      {text: "Без гроша в кармане.", correct: false}
    ]
  },
  {
    text: "Кто такой шлындра?",
    comment: "Да! В Словаре русского арго «шлындрать» означает бездельничать, шляться.",
    answers: [
      {text: "Обманщик.", correct: false},
      {text: "Нытик.", correct: false},
      {text: "Бродяга.", correct: true}
    ]
  }
];

const questionList = document.getElementById("questions-list");
const resultContainer = document.querySelector(".result-container");
const resultText = document.getElementById("result-text");

let currentQuestionIndex = 0;
let correctAnswers = 0;
let expandedQuestion;
let currentQuestionItem;
let answeredQuestions = new Array(questions.length).fill(false);
let questionsAreOver = false;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function displayQuestion(question, index) {
  const questionItem = document.createElement("div");
  currentQuestionItem = questionItem;
  questionItem.id = `question-${index}`;
  questionItem.classList.add("question");
  questionItem.textContent = `${index + 1}. ${question.text}`;
  questionItem.style.transition = "transform 0.2s";

  const answers = document.createElement("div");
  answers.classList.add("answers");
  answers.id = `answers-${index}`;

  questionItem.addEventListener("click", () => selectAnswer(question, index, questionItem));

  questionList.appendChild(questionItem);
  questionList.appendChild(answers);
}


function selectAnswer(question, index, questionItem) {
  if (questionsAreOver) {
    hideCorrectAnswer();
    showCorrectAnswer(index);
  }
  if (index === currentQuestionIndex) {
    hideComment();
    expandQuestion(questionItem);
    const answers = question.answers.slice();
    shuffleArray(answers);

    for (const answer of answers) {
      const answerBlock = document.createElement("div");
      answerBlock.classList.add("answer-block");
      answerBlock.textContent = answer.text;
      answerBlock.dataset.correct = answer.correct;
      let answersForQuestion = document.getElementById(`answers-${index}`);
      answersForQuestion.appendChild(answerBlock);

      answerBlock.addEventListener("click", () => checkAnswer(answer.text, answer.correct, index));
    }

    currentQuestionIndex++;
  }
}

function checkAnswer(selectedAnswer, correctAnswer, questionIndex) {
  // проверка вариантов ответа
  const answerBlocks = document.querySelectorAll(".answer-block");
  const selectedQuestion = document.querySelector(`#question-${questionIndex}`);

  for (const block of answerBlocks) {
    block.style.pointerEvents = "none";
    if (block.dataset.correct === "true") {
      block.style.transition = "transform 2s";
      block.style.transform = "scale(1.1)";
      block.style.marginRight = "5vh";
      block.style.marginLeft = "5vh";
      const tickMark = document.createElement("span");
      tickMark.classList.add("tick-mark");
      tickMark.innerHTML = "&#10004;"; // галочка
      block.appendChild(tickMark);
    } else {
      setTimeout(() => {
        block.style.transition = "transform 5s";
        block.style.transform = "translateY(20000%)";
      }, 1000);
    }
  }

  setTimeout(() => {
    let answersForQuestion = document.getElementById(`answers-${questionIndex}`);
    for (const block of answerBlocks) {
      answersForQuestion.removeChild(block);
    }

    // установка флага ответа на вопрос
    const marker = document.createElement("span");
    marker.classList.add("marker");
    marker.innerHTML = correctAnswer === true ? "&#10004;" : "&#10008;";

    selectedQuestion.appendChild(marker);

    if (correctAnswer === true) {
      selectedQuestion.style.background = "#c2f0c2";
      selectedQuestion.style.transition = "background 0.5s";
      answeredQuestions[questionIndex] = true;
      correctAnswers++;
    } else {
      selectedQuestion.style.background = "#ffb8b8";
      selectedQuestion.style.transition = "background 0.5s";
    }

    if (currentQuestionIndex === questions.length) {
      resultContainer.classList.remove("hidden");
      questionsAreOver = true;
      resultText.textContent = `Правильных ответов: ${correctAnswers} из ${questions.length}`;
    }
    currentQuestionItem.style.width = "100%";
    showComment();
    displayQuestion(questions[currentQuestionIndex], currentQuestionIndex);
  }, 2000);
}

function showCorrectAnswer(questionId) {
  const answerItem = document.createElement("div");
  answerItem.classList.add("answer-block");
  answerItem.id = `correctAnswer-${questionId}`;
  answerItem.textContent = questions[questionId].answers.find(answer => answer.correct).text;

  let currentAnswerDiv = document.getElementById(`answers-${questionId}`);
  currentAnswerDiv.appendChild(answerItem);
}

function hideCorrectAnswer() {
  for (let i = 0; i < questions.length; i++) {
    let currentAnswerDiv = document.getElementById(`answers-${i}`);
    if (currentAnswerDiv.firstChild) {
      currentAnswerDiv.removeChild(currentAnswerDiv.firstChild);
    }
  }
}

function showComment() {
  if (answeredQuestions[currentQuestionIndex - 1]) {
    const commentItem = document.createElement("div");
    commentItem.classList.add("answer-block");
    commentItem.id = `comment-${currentQuestionIndex - 1}`;
    commentItem.textContent = questions[currentQuestionIndex - 1].comment;

    let currentAnswerDiv = document.getElementById(`answers-${currentQuestionIndex - 1}`);
    currentAnswerDiv.appendChild(commentItem);
  }
}

function hideComment() {
  if (currentQuestionIndex > 0 && answeredQuestions[currentQuestionIndex - 1]) {
    let currentAnswerDiv = document.getElementById(`answers-${currentQuestionIndex - 1}`);
    currentAnswerDiv.removeChild(currentAnswerDiv.firstChild);
  }
}

function expandQuestion(questionItem) {
  if (expandedQuestion) {
    expandedQuestion.style.width = "";
  }
  expandedQuestion = questionItem;
  questionItem.style.width = "200px";
}

shuffleArray(questions);
displayQuestion(questions[currentQuestionIndex], currentQuestionIndex);
