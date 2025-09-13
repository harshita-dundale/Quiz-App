
let question_nu = document.getElementsByClassName("question_nu")[0];
let question_txt = document.getElementsByClassName("question_txt")[0];
let option1 = document.getElementById("option1");
let option2 = document.getElementById("option2");
let option3 = document.getElementById("option3");
let option4 = document.getElementById("option4");
let next_btn = document.getElementById("next_btn");
let timer = document.getElementById("timer");

let cur_que = 0;
let score = 0;
let time;
let total_time = 30;
let sec = total_time;

function timecount() {
    timer.innerHTML = sec;
    sec--;
    if (sec < 0) {
        sec = total_time;
        clearInterval(time);
        cur_que++;
        if (cur_que < quizQuestions.length) {
            showQuestion();
        } else {
            goresult();
        }
    }
}

function showQuestion() {
    sec = total_time;
    clearInterval(time);
    time = setInterval(timecount, 1000); // Timer starts here

    document.querySelectorAll('input[name="opt"]').forEach(option => option.checked = false);

    question_nu.innerHTML = (cur_que + 1) + ".";
    question_txt.innerHTML = quizQuestions[cur_que].question;
    option1.innerHTML = quizQuestions[cur_que].op1;
    option2.innerHTML = quizQuestions[cur_que].op2;
    option3.innerHTML = quizQuestions[cur_que].op3;
    option4.innerHTML = quizQuestions[cur_que].op4;
}

next_btn.addEventListener('click', () => {
    let optionSelect = document.querySelector('input[name="opt"]:checked');

    if (!optionSelect) {
        alert("Please select an option");
    } else {
        let correctOpt = quizQuestions[cur_que].Correct;
        if (optionSelect.id === correctOpt) {
            score++;
        }
        cur_que++;
        if (cur_que >= quizQuestions.length) {
            goresult();
        } else {
            showQuestion();
        }
    }
});

function goresult() {
    localStorage.setItem("Score", score);
    location.href = "./QuizApp2.html";
}

let quizQuestions = [];
const url = 'Questions.json';

async function getdata() {
    const response = await fetch(url);
    const data = await response.json();
    quizQuestions = data;
    showQuestion();
}
getdata();
