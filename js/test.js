const scriptUrl = 'https://script.google.com/macros/s/AKfycbydJaIJfJAkPXQ7dG5oHMaFE3JTioggvxFfSfPDrpBSqSeJutomw28QfbBi05sUSb041w/exec';
let start = document.querySelector(".quiz-wrapper");
start.style.display = "none";
let start_btn = document.getElementById("start-container");
start_btn.style.display = "block";

let questions = {};
let currentQuestion = 0;
let overallTimerInterval;
let totalQuestions = 0;
let totalQuizTime = 0; 
let answeredQuestions = new Set();
let userAnswers = {}; 
let start_txt = document.getElementById("btn_txt");
let qstart_btn = document.getElementById("start-button");
start_btn.disabled = true;
const params = new URLSearchParams(window.location.search);
const sheetName = params.get('sheet_name');
const regNo = params.get('student_id');
// Fetch data from Google Sheets
fetch(scriptUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
        sheetName: sheetName,
    })
}).then(response => response.json())
    .then(data => {
        updateLogical(data);
        qstart_btn.disabled = false;
        start_txt.textContent = "Click Start!"
        console.log("Fetched data",data)
    })
    .catch(error => console.error('Error fetching the sheet:', error));

// Function to update questions based on fetched data
function updateLogical(data) {
    
    let count = 0;
    questions = data
    data.forEach(element => {
            count++;
    });

    totalQuestions = Object.keys(questions).length;
    totalQuizTime = totalQuestions * 60;

    console.log('Fetched Questions:', questions);
}

// Function to initialize the quiz
function initializeQuiz() {
    document.getElementById('start-container').style.display = 'none'; // Hide start button container
    document.querySelector('.quiz-wrapper').style.display = 'flex'; // Show quiz container
    loadQuestions();
    startOverallTimer();
}

function loadQuestions() {
    const questionSection = document.getElementById('question-section');
    const questionNumbersDiv = document.getElementById('question-numbers');
    const questionLevel = document.getElementById('qlevel');
    questionLevel.textContent = `Level: ${questions[currentQuestion].level}`;
    questionSection.innerHTML = ''; // Clear the current question display
    questionNumbersDiv.innerHTML = ''; // Clear question numbers display

    const question = questions[currentQuestion];

    if (!question) {
        console.error("Question not found! Check the question data or index.");
        return;
    }

    const questionElement = document.createElement('div');
    questionElement.classList.add('question');
    questionElement.textContent = question.question;
    questionSection.appendChild(questionElement);

    const optionsElement = document.createElement('div');
    optionsElement.classList.add('options');

    for (let i = 1; i <= 4; i++) {
        const option = document.createElement('div');
        option.classList.add('option');
        const optionInput = document.createElement('input');
        optionInput.type = 'radio';
        optionInput.name = 'option';
        optionInput.value = question[`option${i}`];
        optionInput.id = `option${i}`;
        optionInput.onclick = function () {
            answeredQuestions.add(currentQuestion);
            userAnswers[currentQuestion] = optionInput.value; // Store the selected answer
            updateStatus();
        };
        const optionLabel = document.createElement('label');
        optionLabel.htmlFor = `option${i}`;
        optionLabel.textContent = question[`option${i}`];
        option.appendChild(optionInput);
        option.appendChild(optionLabel);
        optionsElement.appendChild(option);
    }

    questionSection.appendChild(optionsElement);
    questionSection.classList.add('active'); // Set section to active to display

    for (let i = 0; i < totalQuestions; i++) {
        const numberElement = document.createElement('div');
        numberElement.classList.add('question-number');
        numberElement.textContent = i + 1;
        numberElement.onclick = function () {
            currentQuestion = i;
            loadQuestions();
        };
        if (answeredQuestions.has(i)) {
            numberElement.classList.add('answered');
        }
        questionNumbersDiv.appendChild(numberElement);
    }
}

function updateStatus() {
    document.getElementById('notAnswered').textContent = totalQuestions - answeredQuestions.size;
    document.getElementById('answered').textContent = answeredQuestions.size;
}

function nextQuestion() {
    if (currentQuestion < totalQuestions - 1) {
        currentQuestion++;
        loadQuestions();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestions();
    }
}

let currentReviewQuestion = 0;
let score = 0;
function submitQuiz() {
    document.querySelector('.quiz-wrapper').style.display = 'none';
    document.getElementById('results').style.display = 'block';

    
    Object.keys(questions).forEach((questionIndex) => {
        const question = questions[questionIndex];
        if (userAnswers[questionIndex] == question.answer) {
            score += Number(question.marks);
        }
    });

    document.getElementById('score').textContent = score;

    sendData(regNo,sheetName,score);
}


function restartQuiz() {
    answeredQuestions.clear();
    userAnswers = {}; // Clear user answers
    currentQuestion = 0;
    document.getElementById('results').style.display = 'none';
    document.querySelector('.quiz-wrapper').style.display = 'flex';
    loadQuestions();
    startOverallTimer();
}

function startOverallTimer() {
    let totalTime = totalQuizTime;
    overallTimerInterval = setInterval(() => {
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;
        document.getElementById('overall-timer').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        totalTime--;

        if (totalTime < 0) {
            clearInterval(overallTimerInterval);
            alert('Time is up!');
            submitQuiz();
        }
    }, 1000);
}

function sendData(regNo, sheetName, score) {
    console.log('test',sheetName)
    console.log('score',score)
    const Url = 'https://script.google.com/macros/s/AKfycbwCWZfosoectnd33d0Qq3jWqXCRiPTM0VQKFrolG09duBninIP5yAj4JMOx8hJTiPCGcw/exec';
    var payload = {
      regNo: regNo,
      testName: sheetName,
      score: score
    };

    $.post(Url, JSON.stringify(payload), function(response) {
      console.log('Response from server: ' + response);
    }).fail(function(xhr, status, error) {
      console.error('Error:', error);
    });
  }

document.getElementById('start-button').addEventListener('click', initializeQuiz);
document.getElementById('start-button').addEventListener('click', ()=>{
    start.style.display = "flex";
    start_btn.style.display = "none";
});